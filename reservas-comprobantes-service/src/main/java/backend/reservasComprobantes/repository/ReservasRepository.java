package backend.reservasComprobantes.repository;

import backend.reservasComprobantes.entity.ReservasEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservasRepository extends JpaRepository<ReservasEntity, Long> {
    public List<ReservasEntity> findByDate(LocalDate date);
}
