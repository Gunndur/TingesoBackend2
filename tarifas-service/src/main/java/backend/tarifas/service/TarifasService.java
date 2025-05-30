package backend.tarifas.service;

import org.springframework.stereotype.Service;

@Service
public class TarifasService {

    public double getFee(int fee1) {
        double fee2 = fee1;

        if (fee2 == 1) {
            fee2 = 15000;
        } else if (fee2 == 2) {
            fee2 = 20000;
        } else if (fee2 == 3) {
            fee2 = 25000;
        }
        return fee2;
    }
}
