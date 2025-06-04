package backend.reportes.service;

import backend.reportes.model.Comprobantes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReportesService {

    @Autowired
    private RestTemplate restTemplate;

    // Reporte de ingresos por mes dependiendo del fee
    public List<Double> reportePorFee(int fee) {
        List<Double> reporte = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            reporte.add(0.0);

            // Llamada al servicio comprobantes para obtener los recibos
            String url = "http://reservas-comprobantes-service/comprobantes/fee/" + fee + "/month/" + i;
            Comprobantes[] comprobantes = restTemplate.getForObject(url, Comprobantes[].class);

            if (comprobantes != null) {
                for (Comprobantes comprobante : comprobantes) {
                    double monto = comprobante.getFinalAmount();
                    reporte.set(i, reporte.get(i) + monto);
                }
            }
        }
        return reporte;
    }

    // Reporte de ingresos por mes dependiendo del tamaño del grupo
    public List<Double> reportePorGrupo(int groupSize) {
        List<Double> reporte = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            reporte.add(0.0);

            String url = "http://reservas-comprobantes-service/comprobantes/groupSize/" + groupSize + "/month/" + i;
            Comprobantes[] comprobantes = restTemplate.getForObject(url, Comprobantes[].class);

            if (comprobantes != null) {
                for (Comprobantes comprobante : comprobantes) {
                    double monto = comprobante.getFinalAmount();
                    reporte.set(i, reporte.get(i) + monto);
                }
            }
        }
        return reporte;
    }
}
