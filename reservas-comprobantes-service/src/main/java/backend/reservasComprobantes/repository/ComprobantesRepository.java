package backend.reservasComprobantes.repository;

import backend.reservasComprobantes.entity.ComprobantesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComprobantesRepository extends JpaRepository<ComprobantesEntity, Long> {
    public List<ComprobantesEntity> findByUserRut(String userRut);
    public List<ComprobantesEntity> findByReserva(long idReserva);
    public List<ComprobantesEntity> findByFee(int fee);

    // Query para obtener una lista de receipt que busca por el fee y el mes
    @Query("SELECT r FROM ComprobantesEntity r WHERE r.fee = :fee AND MONTH(r.date) = :month")
    List<ComprobantesEntity> findByFeeAndMonth(@Param("fee") int fee, @Param("month") int month);
}
