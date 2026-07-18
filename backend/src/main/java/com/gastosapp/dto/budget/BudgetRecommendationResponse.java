package com.gastosapp.dto.budget;

import java.math.BigDecimal;
import java.util.List;

public record BudgetRecommendationResponse(
        String mesReferencia,
        BigDecimal salarioBase,
        List<RecommendationGroup> grupos,
        BigDecimal naoAlocado,
        List<String> avisos
) {
}
