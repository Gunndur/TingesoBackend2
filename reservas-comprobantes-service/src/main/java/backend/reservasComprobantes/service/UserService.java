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

    public ArrayList<UserEntity> getUsers(){
        return (ArrayList<UserEntity>) userRepository.findAll();
    }
    public UserEntity getUserByRut(String rut) {return userRepository.findByRut(rut);}
    public UserEntity saveUser(UserEntity user) {return userRepository.save(user);}
    public UserEntity updateUser(UserEntity user) {return userRepository.save(user);}
    public UserEntity findByRut(String rut) {
        return userRepository.findByRut(rut);
    }

    public boolean deleteUser(Long id) throws Exception {
        try {
            userRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

}
