package backend.descDE.controller;

import backend.descDE.service.DescDeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/descde")
public class DescDeController {

    @Autowired
    DescDeService descDeService;

    @GetMapping("/SpecialRateWeekend")
    public ResponseEntity<Double> descCfSpecialRateWeekend(
            @RequestParam LocalDate date
    ) {
        double descDe1 = descDeService.getDiscountBySpecialRateWeekend(date);
        return ResponseEntity.ok(descDe1);
    }

    @GetMapping("/UserBirthday")
    public ResponseEntity<Double> descCfUserBirthday(
            @RequestParam LocalDate birthday,
            @RequestParam LocalDate reservaDate
    ) {
        double descDe2 = descDeService.isUserBirthday(birthday, reservaDate);
        return ResponseEntity.ok(descDe2);
    }
}
