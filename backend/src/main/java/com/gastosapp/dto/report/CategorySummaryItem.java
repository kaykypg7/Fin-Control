package com.gastosapp.dto.report;

import com.gastosapp.domain.enums.Grupo503020;

import java.math.BigDecimal;

public record CategorySummaryItem(
        Long categoryId,
        String nome,
        String cor,
        Grupo503020 grupo503020,
        BigDecimal valorMeta,
        BigDecimal valorGasto
) {
}
