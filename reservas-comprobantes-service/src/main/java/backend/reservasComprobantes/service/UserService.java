package backend.reservasComprobantes.service;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.entity.UserEntity;
import backend.reservasComprobantes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    ComprobantesService comprobanteService;

    public ArrayList<UserEntity> getUsers(){
        return (ArrayList<UserEntity>) userRepository.findAll();
    }
    public UserEntity getUserByRut(String rut) {return userRepository.findByRut(rut);}
    public UserEntity saveUser(UserEntity user) {return userRepository.save(user);}
    public UserEntity updateUser(UserEntity user) {return userRepository.save(user);}

    public boolean deleteUser(Long id) throws Exception {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }


    //Calcula la frecuencia de un usuario, buscando la cantidad de reservas asociadas a su correo dentro del mes actual.
    public UserEntity updateFrequentUser(String rut) {
        UserEntity user = userRepository.findByRut(rut);
        String userRut = user.getRut();
        int count = 0;
        int frequent = 0;
        LocalDate currentDate = LocalDate.now();
        int currentYear = currentDate.getYear();
        int currentMonth = currentDate.getMonthValue();

        for (ComprobantesEntity comprobante : comprobanteService.getComprobanteByUserRut(userRut)) {
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
        return userRepository.save(user);
    }
}
