package backend.reservasComprobantes.service;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.entity.UserEntity;
import backend.reservasComprobantes.repository.ComprobantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ComprobantesService {

    @Autowired
    ComprobantesRepository comprobanteRepository;
    @Autowired
    UserService userService;
    @Autowired
    RestTemplate restTemplate;

    public ComprobantesEntity saveComprobante(ComprobantesEntity comprobante) {return comprobanteRepository.save(comprobante);}

    public List<ComprobantesEntity> getComprobanteByIdReserva(long idReserva) {
        return (List<ComprobantesEntity>) comprobanteRepository.findByIdReserva(idReserva);
    }

    public List<ComprobantesEntity> getComprobanteByUserRut(String userRut) {
        return (List<ComprobantesEntity>) comprobanteRepository.findByUserRut(userRut);
    }

    public boolean deleteComprobante(Long id) throws Exception {
        try {
            comprobanteRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // Cálculo descuento por cliente frecuente [2]
    public double getDiscountByFrequentCustomer(ComprobantesEntity comprobante) {
        double discount = 0;
        UserEntity user = userService.getUserByRut(comprobante.getUserRut());
        updateFrequentUser(user.getRut());

        int frequent = user.getFrequent();
        String url = "http://desc-cf-service/desccf/?frequent=" + frequent;
        discount = restTemplate.getForObject(url, Double.class);

        return discount;
    }

    // Cálculo descuento por tarifa especial sab-dom [3]
    public double getDiscountBySpecialRateWeekend(ComprobantesEntity comprobante) {
        double discount = 0;
        LocalDate date = comprobante.getDate();
        String url = "http://desc-de-service/descde/SpecialRateWeekend?date=" + date;
        discount = restTemplate.getForObject(url, Double.class);

        return discount;
    }

    // Cálculo descuento por cumpleaños [4]
    public double isUserBirthday(ComprobantesEntity comprobante) {
        UserEntity user = userService.getUserByRut(comprobante.getUserRut());
        double discount = 0;
        if (user != null && user.getBirthdate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate birthday = LocalDate.parse(user.getBirthdate(), formatter);
            LocalDate reservaDate = comprobante.getDate();

            String url = "http://desc-de-service/descde/UserBirthday?birthday=" + birthday + "&reservaDate=" + reservaDate;
            discount = restTemplate.getForObject(url, Double.class);
        }
        return discount;
    }

    //Calcular precios varios para cada comprobante
    public ComprobantesEntity setPrices(ComprobantesEntity comprobante) {
        int fee = comprobante.getFee();
        double fee2 = 0;

        String url = "http://tarifas-service/tarifas/fee?fee1=" + fee;
        fee2 = restTemplate.getForObject(url, Double.class);

        double discount = comprobante.getMaxDesc();
        double amount = fee2 - (fee2 * discount);
        double total = amount + (amount * 0.19);

        comprobante.setAmount(amount);
        comprobante.setIVA(0.19);
        comprobante.setFinalAmount(total);

        return saveComprobante(comprobante);
    }

    //Calcula la frecuencia de un usuario, buscando la cantidad de reservas asociadas a su correo dentro del mes actual.
    public UserEntity updateFrequentUser(String rut) {
        UserEntity user = userService.findByRut(rut);
        String userRut = user.getRut();
        int count = 0;
        int frequent = 0;
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
        int currentMonth = currentDate.getMonthValue();

        for (ComprobantesEntity comprobante : getComprobanteByUserRut(userRut)) {
            LocalDate comprobanteDate = comprobante.getDate();
            if (comprobanteDate.getYear() == currentYear && comprobanteDate.getMonthValue() == currentMonth) {
                count++;
            }
        }

        if (count >= 0 && count <= 1) {
            frequent = 0;
        } else if (count >= 2 && count <= 4) {
            frequent = 1;
        } else if (count >= 5 && count <= 6) {
            frequent = 2;
        } else if (count >= 7) {
            frequent = 3;
        }

        user.setFrequent(frequent);
        return userService.saveUser(user);
    }
}