package backend.reportes.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comprobantes {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private LocalTime time_final;
    private String userName;
    private String userRut;
    private long idReserva;
    private double maxDesc;
    private int typeDesc;
    private int fee;
    private double amount;
    private double iva;
    private double finalAmount;
}
