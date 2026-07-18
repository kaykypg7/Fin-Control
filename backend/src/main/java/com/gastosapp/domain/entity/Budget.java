package com.gastosapp.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "mes_referencia", nullable = false, length = 7)
    private String mesReferencia;

    @Setter
    @Column(name = "valor_meta", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorMeta;

    public Budget(Long userId, Long categoryId, String mesReferencia, BigDecimal valorMeta) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.mesReferencia = mesReferencia;
        this.valorMeta = valorMeta;
    }
}
