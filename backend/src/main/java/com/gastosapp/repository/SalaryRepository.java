package com.gastosapp.repository;

import com.gastosapp.domain.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    Optional<Salary> findByUserIdAndMesReferencia(Long userId, String mesReferencia);

    Optional<Salary> findTopByUserIdOrderByMesReferenciaDesc(Long userId);
}
