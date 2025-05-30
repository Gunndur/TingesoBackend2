package backend.descCF.controller;

import backend.descCF.service.DescCfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/desccf")
public class DescCfController {
    @Autowired
    DescCfService descCfService;

    @GetMapping("/")
    public ResponseEntity<Double> descCf(
            @RequestParam int frequent
    ) {
        double descCf = descCfService.getDiscountByFrequentCustomer(frequent);
        return ResponseEntity.ok(descCf);
    }
}
