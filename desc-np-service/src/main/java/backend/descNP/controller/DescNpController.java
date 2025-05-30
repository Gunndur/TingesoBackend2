package backend.descNP.controller;

import backend.descNP.service.DescNpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/descnp")
public class DescNpController {
    @Autowired
    DescNpService descNpService;

    @GetMapping("/")
    public ResponseEntity<Double> descCf(
            @RequestParam int numberOfPeople
    ) {
        double descNp = descNpService.getDiscountByNumberOfPeople(numberOfPeople);
        return ResponseEntity.ok(descNp);
    }
}
