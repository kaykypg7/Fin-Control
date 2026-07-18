package com.gastosapp.repository;

import com.gastosapp.domain.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdAndDataBetween(Long userId, LocalDate inicio, LocalDate fim);

    List<Transaction> findByUserIdAndCategoryIdAndDataBetween(Long userId, Long categoryId, LocalDate inicio, LocalDate fim);

    long countByUserId(Long userId);

    @Query("""
            SELECT COALESCE(SUM(t.valor), 0) FROM Transaction t
            WHERE t.userId = :userId AND t.categoryId = :categoryId AND t.data BETWEEN :inicio AND :fim
            """)
    BigDecimal sumByUserAndCategoryBetween(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim);
}
