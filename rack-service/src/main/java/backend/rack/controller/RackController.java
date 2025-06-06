package backend.rack.controller;

import backend.rack.service.RackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rack")
public class RackController {
    @Autowired
    RackService rackService;

    // No tiene funciones específicas implementadas, ya que lo necesario para esta entrega lo puede hacer el frontend directamente

}
