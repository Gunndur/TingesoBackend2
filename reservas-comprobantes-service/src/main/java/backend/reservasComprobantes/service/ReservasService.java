package backend.reservasComprobantes.service;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.entity.ReservasEntity;
import backend.reservasComprobantes.entity.UserEntity;
import backend.reservasComprobantes.repository.ReservasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ReservasService {
    @Autowired
    ReservasRepository reservasRepository;
    @Autowired
    UserService userService;
    @Autowired
    ComprobantesService comprobantesService;
    @Autowired
    RestTemplate restTemplate;

    public ArrayList<ReservasEntity> getAllReservas(){
        return (ArrayList<ReservasEntity>) reservasRepository.findAll();
    }

    public ReservasEntity getReservaById(long id) {return reservasRepository.findById(id).get();}
    public ReservasEntity saveReserva(ReservasEntity reserva) {return reservasRepository.save(reserva);}

    public boolean deleteReserva(Long id) throws Exception {
        ReservasEntity body = reservasRepository.findById(id).get();
        List<ComprobantesEntity> comprobantes = comprobantesService.getComprobanteByIdReserva(body.getId());
        // Eliminar todos los recibos asociados al Reserva
        for (ComprobantesEntity comprobante : comprobantes) {
            try {
                comprobantesService.deleteComprobante(comprobante.getId());
            } catch (Exception e) {
                System.out.println("Error al eliminar el recibo: " + e.getMessage());
            }
        }

        try {
            reservasRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public ReservasEntity saveReservaAll(ReservasEntity body){

        // Validar el tiempo de la reserva
        setFinalTime(body);
        if(!validTime(body)){
            return body;
        }
        reservasRepository.save(body);

        // Por cada usuario en la lista de usuarios, crear un comprobante nuevo asociado al usuario y al Reserva
        for (String userRut : body.getUsers()) {
            UserEntity user = userService.getUserByRut(userRut);
            if (user == null) {
                System.out.println("Usuario no encontrado para el RUT: " + userRut);
            }
            if (user != null) {

                ComprobantesEntity comprobante = new ComprobantesEntity();
                comprobante.setUserName(user.getName());
                comprobante.setDate(body.getDate());
                comprobante.setTime(body.getTime());
                comprobante.setFee(body.getFee());
                comprobante.setUserRut(user.getRut());
                comprobante.setTime_final(body.getTime_final());
                comprobante.setIdReserva(body.getId());
                comprobante = setBestDiscountInComprobante(comprobante, body);
                comprobante = comprobantesService.setPrices(comprobante);
                comprobantesService.saveComprobante(comprobante);
            }
        }
        return body;
    }

    // Actualiza la reserva y elimina todos los recibos asociados a la reserva y crea los nuevos.
    @Transactional
    public ReservasEntity updateReservaAll(ReservasEntity body) {
        List<ComprobantesEntity> comprobantes = comprobantesService.getComprobanteByIdReserva(body.getId());
        // Eliminar todos los recibos asociados al Reserva
        for (ComprobantesEntity comprobante : comprobantes) {
            try {
                comprobantesService.deleteComprobante(comprobante.getId());
            } catch (Exception e) {
                System.out.println("Error al eliminar el recibo: " + e.getMessage());
            }
        }
        return saveReservaAll(body);
    }

    // Calcular hora de salida de la reserva.
    public void setFinalTime(ReservasEntity reserva) {
        int fee = reserva.getFee();
        LocalTime startTime = reserva.getTime();

        String url = "http://tarifas-service/tarifas/time?fee=" + fee;
        Integer time = null;
        try {
            time = restTemplate.getForObject(url, Integer.class);
            if (time == null) {
                throw new IllegalStateException("El servicio de tarifas devolvió null por el tiempo.");
            }
            reserva.setTime_final(startTime.plusMinutes(time));
        } catch (Exception e) {
            System.out.println("Error al obtener el tiempo final: " + e.getMessage());
        }
        return;
    }

    // Validar que entre la hora de inicio y la hora final no existan otras reservas del mismo día.
    public boolean validTime(ReservasEntity a) {
        List<ReservasEntity> reservas = reservasRepository.findByDate(a.getDate());

        for (ReservasEntity b : reservas) {
            if (!Objects.equals(b.getId(), a.getId())) {
                // Verificar si hay solapamiento
                if (!(a.getTime().isAfter(b.getTime_final()) || a.getTime_final().isBefore(b.getTime()))) {
                    return false; // Hay solapamiento
                }
            }
        }
        return true; // No hay solapamientos
    }

    // Encontrar el mejor descuento para cada comprobante y asignarlo al comprobante correspondiente
    public ComprobantesEntity setBestDiscountInComprobante(ComprobantesEntity comprobante, ReservasEntity reservas) {

        int numberOfPeople = reservas.getNumberOfPeople();
        String url = "http://desc-np-service/descnp/?numberOfPeople=" + numberOfPeople;

        double discount1 = 0.0; // [1]
        try {
            Double response = restTemplate.getForObject(url, Double.class);
            discount1 = response != null ? response : 0.0;
        } catch (Exception e) {
            System.out.println("Error al obtener el descuento por número de personas: " + e.getMessage());
        }
        double discount2 = comprobantesService.getDiscountByFrequentCustomer(comprobante); // [2]
        double discount3 = comprobantesService.getDiscountBySpecialRateWeekend(comprobante); // [3]
        double discount4 = comprobantesService.isUserBirthday(comprobante); // [4]

        if (discount1 > discount2 && discount1 > discount3 && discount1 > discount4) {
            comprobante.setMaxDesc(discount1);
            comprobante.setTypeDesc(1);
        } else if (discount2 >= discount1 && discount2 > discount3 && discount2 > discount4) {
            comprobante.setMaxDesc(discount2);
            comprobante.setTypeDesc(2);
        } else if (discount3 > discount1 && discount3 > discount2 && discount3 > discount4) {
            comprobante.setMaxDesc(discount3);
            comprobante.setTypeDesc(3);
        } else if (discount4 > discount1 && discount4 > discount2 && discount4 > discount3) {
            comprobante.setMaxDesc(discount4);
            comprobante.setTypeDesc(4);
        } else {
            comprobante.setMaxDesc(0);
            comprobante.setTypeDesc(0);
        }
        return comprobantesService.saveComprobante(comprobante);
    }

}