package backend.reservasComprobantes.service;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.entity.UserEntity;
import backend.reservasComprobantes.repository.ComprobantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComprobantesService {

    @Autowired
    ComprobantesRepository comprobanteRepository;
    @Autowired
    ComprobantesService comprobantesService;
    @Autowired
    UserService userService;
    @Autowired
    RestTemplate restTemplate;

    public ArrayList<ComprobantesEntity> getAllComprobantes(){
        return (ArrayList<ComprobantesEntity>) comprobanteRepository.findAll();
    }

    public ArrayList<ComprobantesEntity> getAllComprobanteByFee(int fee){
        return (ArrayList<ComprobantesEntity>) comprobanteRepository.findByFee(fee);
    }
    public ArrayList<ComprobantesEntity> getAllComprobanteByFeeAndMonth(int fee, int month){
        return (ArrayList<ComprobantesEntity>) comprobanteRepository.findByFeeAndMonth(fee, month);
    }
    public ComprobantesEntity getComprobanteById(long id) {
        return comprobanteRepository.findById(id).orElse(null);
    }

    public ComprobantesEntity saveComprobante(ComprobantesEntity comprobante) {return comprobanteRepository.save(comprobante);}

    public List<ComprobantesEntity> getComprobanteByIdReserva(long idReserva) {
        return (List<ComprobantesEntity>) comprobanteRepository.findByReserva(idReserva);
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
        userService.updateFrequentUser(user.getRut());

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

        String url = "http://tarifas-service/tarifas/?fee1=" + fee;
        fee2 = restTemplate.getForObject(url, Double.class);

        double discount = comprobante.getMaxDesc();
        double amount = fee2 - (fee2 * discount);
        double total = amount + (amount * 0.19);

        comprobante.setAmount(amount);
        comprobante.setIVA(0.19);
        comprobante.setFinalAmount(total);

        return comprobantesService.saveComprobante(comprobante);
    }
}