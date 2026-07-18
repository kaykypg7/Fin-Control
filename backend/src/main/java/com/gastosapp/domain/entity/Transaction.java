package com.gastosapp.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Setter
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Setter
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Setter
    @Column(nullable = false)
    private LocalDate data;

    @Setter
    @Column(length = 255)
    private String descricao;

    public Transaction(Long userId, Long categoryId, BigDecimal valor, LocalDate data, String descricao) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.valor = valor;
        this.data = data;
        this.descricao = descricao;
    }
}
