package com.gastosapp.dto.report;

import java.math.BigDecimal;

public record CategoryEvolutionItem(
        String mesReferencia,
        Long categoryId,
        String nome,
        BigDecimal valorGasto
) {
}
