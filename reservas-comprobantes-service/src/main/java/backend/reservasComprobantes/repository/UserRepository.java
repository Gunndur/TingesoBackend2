package backend.reservasComprobantes.repository;

import backend.reservasComprobantes.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    @Query("SELECT e FROM UserEntity e WHERE e.rut = :rut")
    UserEntity findByRut(@Param("rut") String rut);
}
