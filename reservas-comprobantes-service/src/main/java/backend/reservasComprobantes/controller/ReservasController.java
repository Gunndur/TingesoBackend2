package backend.reservasComprobantes.controller;

import backend.reservasComprobantes.entity.ReservasEntity;
import backend.reservasComprobantes.service.ReservasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservas")
public class ReservasController {
    @Autowired
    ReservasService reservasService;

    @PostMapping("/")
    public ResponseEntity<ReservasEntity> createBooking(@RequestBody ReservasEntity body){
        return ResponseEntity.ok(reservasService.saveReservaAll(body));
    }

    @PutMapping("/")
    public ResponseEntity<ReservasEntity> updateBooking(@RequestBody ReservasEntity body){
        ReservasEntity newBooking = reservasService.updateReservaAll(body);
        return ResponseEntity.ok(newBooking);
    }

    @GetMapping("/")
    public ResponseEntity<Iterable<ReservasEntity>> listBookings() {
        Iterable<ReservasEntity> bookings = reservasService.getAllReservas();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservasEntity> getBookingById(@PathVariable Long id){
        ReservasEntity booking = reservasService.getReservaById(id);
        return ResponseEntity.ok(booking);
    }

    /*
    @GetMapping("/reportePorFee")
    public ResponseEntity<List<Double>> reportePorFee(@RequestParam int fee){
        ResponseEntity<List<Double>> reporte = (ResponseEntity<List<Double>>) officeKRmService.reportePorFee(fee);
        return ResponseEntity.ok(reporte.getBody());
    }*/


    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteBooking(@PathVariable Long id) throws Exception {
        var isDeleted = reservasService.deleteReserva(id);
        return ResponseEntity.noContent().build();
    }
}
