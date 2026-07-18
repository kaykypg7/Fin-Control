package com.gastosapp.dto.report;

import java.math.BigDecimal;
import java.util.List;

public record MonthlySummaryResponse(
        String mesReferencia,
        BigDecimal salario,
        BigDecimal totalMetas,
        BigDecimal totalGasto,
        List<CategorySummaryItem> porCategoria
) {
}
