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
    public List<ComprobantesEntity> findByIdReserva(long idReserva);

}
