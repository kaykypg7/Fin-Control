package com.gastosapp.dto.report;

import java.math.BigDecimal;

public record MonthlyComparisonItem(
        String mesReferencia,
        BigDecimal salario,
        BigDecimal totalMeta,
        BigDecimal totalGasto
) {
}
