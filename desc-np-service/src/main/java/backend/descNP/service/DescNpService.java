package backend.descNP.service;

import org.springframework.stereotype.Service;


@Service
public class DescNpService {
    // Cálculo descuento por número de personas [1]
    public double getDiscountByNumberOfPeople(int numberOfPeople) {
        double discount = 0;
        if (numberOfPeople >= 3 && numberOfPeople <= 5) {
            discount = 0.1;
        } else if (numberOfPeople >= 6 && numberOfPeople <= 10) {
            discount = 0.2;
        } else if (numberOfPeople >= 11) {
            discount = 0.3;
        }
        return discount;
    }
}
