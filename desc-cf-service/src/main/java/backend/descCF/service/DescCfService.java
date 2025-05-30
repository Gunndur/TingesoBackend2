package backend.descCF.service;

import org.springframework.stereotype.Service;

@Service
public class DescCfService {

    // Cálculo descuento por cliente frecuente [2]
    public double getDiscountByFrequentCustomer(int frequent) {
        double discount = 0;
        if (frequent == 1) {
            discount = 0.1;
        } else if (frequent == 2) {
            discount = 0.2;
        } else if (frequent == 3) {
            discount = 0.3;
        }
        return discount;
    }

}
