package backend.reservasComprobantes.controller;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boletas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComprobantesController {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private LocalDate date;
    private LocalTime time;
    private LocalTime time_final;

    private int numberOfPeople; // Number of participants
    private String principalUser; //Persona que hizo la reserva

    private int fee;    //Tarifas bases del 1 al 3

    @ElementCollection
    private List<String> users = new ArrayList<>(); //Lista de personas asociadas a la reserva
}
