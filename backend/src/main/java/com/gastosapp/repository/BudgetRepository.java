package com.gastosapp.repository;

import com.gastosapp.domain.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdAndMesReferencia(Long userId, String mesReferencia);

    Optional<Budget> findByUserIdAndCategoryIdAndMesReferencia(Long userId, Long categoryId, String mesReferencia);
}
