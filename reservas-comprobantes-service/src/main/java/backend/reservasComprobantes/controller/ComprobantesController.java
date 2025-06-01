package backend.reservasComprobantes.controller;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import backend.reservasComprobantes.service.ComprobantesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/comprobantes")
public class ComprobantesController {
    @Autowired
    ComprobantesService comprobantesService;

    @GetMapping("/{id}")
    public ResponseEntity<List<ComprobantesEntity>> getReceipts(@PathVariable long id) {
        List<ComprobantesEntity> comprobantes = comprobantesService.getComprobanteByIdReserva(id);
        return ResponseEntity.ok(comprobantes);
    }
}
