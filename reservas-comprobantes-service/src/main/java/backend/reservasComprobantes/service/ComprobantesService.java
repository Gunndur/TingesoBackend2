package backend.reservasComprobantes.service;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.entity.UserEntity;
import backend.reservasComprobantes.repository.ComprobantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // LLamar al microservicio desccf/ para obtener el descuento
        return discount;
    }

    // Cálculo descuento por tarifa especial sab-dom [3]
    public double getDiscountBySpecialRateWeekend(ComprobantesEntity comprobante) {
        double discount = 0;
        LocalDate comprobanteDay = comprobante.getDate();

        // LLamar al microservicio descde/SpecialRateWeekend para obtener el descuento
        return discount;
    }

    // Cálculo descuento por cumpleaños [4]
    public double isUserBirthday(ComprobantesEntity comprobante) {
        UserEntity user = userService.getUserByRut(comprobante.getUserRut());
        double discount = 0;

        if (user != null && user.getBirthdate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate birthday = LocalDate.parse(user.getBirthdate(), formatter);
            LocalDate bookingDate = comprobante.getDate();

            // LLamar al microservicio descde/UserBirthday para obtener el descuento
        }
        return discount;
    }

    //Calcular precios varios para cada comprobante
    public ComprobantesEntity setPrices(ComprobantesEntity comprobante) {
        double fee = comprobante.getFee();

        // LLamar al microservicio trifas/

        double discount = comprobante.getMaxDesc();
        double amount = fee - (fee * discount);
        double total = amount + (amount * 0.19);

        comprobante.setAmount(amount);
        comprobante.setIVA(0.19);
        comprobante.setFinalAmount(total);

        return comprobantesService.saveComprobante(comprobante);
    }
}