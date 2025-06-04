package backend.tarifas.service;

import org.springframework.stereotype.Service;

@Service
public class TarifasService {

    // Calcular tarifa de la reserva.
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

    // Calcular hora de salida de la reserva.
    public int getFinalTime(int fee) {
        int minutes = 0;

        if (fee == 1) {
            minutes = 30;
        } else if (fee == 2) {
            minutes = 35;
        } else if (fee == 3) {
            minutes = 40;
        }
        return minutes;
    }
}
