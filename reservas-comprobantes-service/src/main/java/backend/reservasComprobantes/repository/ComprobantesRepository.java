package backend.reservasComprobantes.repository;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface ComprobantesRepository extends JpaRepository<ComprobantesEntity, Long> {
    public List<ComprobantesEntity> findByUserRut(String userRut);
    public List<ComprobantesEntity> findByIdReserva(long idReserva);

    // Query para obtener una lista de receipt que busca por el fee y el mes
    @Query("SELECT r FROM ComprobantesEntity r WHERE r.fee = :fee AND MONTH(r.date) = :month")
    List<ComprobantesEntity> findByFeeAndMonth(@Param("fee") int fee, @Param("month") int month);

    @Query("SELECT c FROM ComprobantesEntity c WHERE c.idReserva IN (SELECT r.id FROM ReservasEntity r WHERE r.numberOfPeople = :groupSize) AND MONTH(c.date) = :month")
    List<ComprobantesEntity> findByGroupSizeAndMonth(int groupSize, int month);
}
