package com.gastosapp.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "salaries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "mes_referencia", nullable = false, length = 7)
    private String mesReferencia;

    @Setter
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    public Salary(Long userId, String mesReferencia, BigDecimal valor) {
        this.userId = userId;
        this.mesReferencia = mesReferencia;
        this.valor = valor;
    }
}
