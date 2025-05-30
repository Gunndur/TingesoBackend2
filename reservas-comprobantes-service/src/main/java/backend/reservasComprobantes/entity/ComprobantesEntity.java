package backend.reservasComprobantes.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "comprobantes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComprobantesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private LocalDate date;
    private LocalTime time;
    private LocalTime time_final;

    private String UserName;
    private String userRut; //Persona asociada a la reserva
    private long idReserva; // Id de la reserva asociada

    private double MaxDesc; // Descuento máximo permitido
    private int TypeDesc; // Tipo de descuento 0-1-2-3-4

    private int fee; //Monto total de la reserva sin descuentos (solo la tarifa) 1-2-3
    private double amount; //Monto total de la reserva con descuentos
    private double IVA; //Monto total de la reserva
    private double finalAmount; //Monto total de la reserva
}
