package backend.tarifas.controller;


import backend.tarifas.service.TarifasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tarifas")
public class TarifasController {

    @Autowired
    TarifasService tarifasService;

    @GetMapping("/")
    public ResponseEntity<Double> totalCost(
            @RequestParam int fee1
    ) {
        double fee2 = tarifasService.getFee(fee1);
        return ResponseEntity.ok(fee2);
    }
}
