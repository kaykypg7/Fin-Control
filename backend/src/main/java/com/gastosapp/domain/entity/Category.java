package com.gastosapp.domain.entity;

import com.gastosapp.domain.enums.CategoryTipo;
import com.gastosapp.domain.enums.Grupo503020;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Null = categoria padrao do sistema, visivel/editavel por qualquer usuario. */
    @Column(name = "user_id")
    private Long userId;

    @Setter
    @Column(nullable = false, length = 80)
    private String nome;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private CategoryTipo tipo;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_503020", nullable = false, length = 12)
    private Grupo503020 grupo503020;

    @Setter
    @Column(nullable = false, length = 7)
    private String cor;

    @Setter
    @Column(nullable = false, length = 50)
    private String icone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Category(Long userId, String nome, CategoryTipo tipo, Grupo503020 grupo503020, String cor, String icone) {
        this.userId = userId;
        this.nome = nome;
        this.tipo = tipo;
        this.grupo503020 = grupo503020;
        this.cor = cor;
        this.icone = icone;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public boolean isSystemDefault() {
        return userId == null;
    }
}
