package backend.descDE.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DescDeService {

    // Cálculo descuento por tarifa especial sab-dom [3]
    public double getDiscountBySpecialRateWeekend(LocalDate Date) {
        double discount = 0;

        if (Date.getDayOfWeek().getValue() == 6 || Date.getDayOfWeek().getValue() == 7) {
            discount = 0.15;
        }
        return discount;
    }

    // Cálculo descuento por cumpleaños [4]
    public double isUserBirthday(LocalDate birthday, LocalDate reservaDate) {
        double discount = 0;

        if (reservaDate.getMonth() == birthday.getMonth() && reservaDate.getDayOfMonth() == birthday.getDayOfMonth()) {
            discount = 0.5;
        }
        return discount;
    }
}
