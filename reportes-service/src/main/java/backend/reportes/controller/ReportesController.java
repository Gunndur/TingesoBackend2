package backend.reportes.controller;

import backend.reportes.service.ReportesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reportes")
public class ReportesController {

    @Autowired
    private ReportesService reportesService;

    // Endpoint para reporte por fee
    @GetMapping("/fee/{fee}")
    public List<Double> getReportePorFee(@PathVariable int fee) {
        return reportesService.reportePorFee(fee);
    }

    // Endpoint para reporte por tamaño de grupo
    @GetMapping("/grupo/{groupSize}")
    public List<Double> getReportePorGrupo(@PathVariable int groupSize) {
        return reportesService.reportePorGrupo(groupSize);
    }
}
