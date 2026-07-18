package com.gastosapp.dto.budget;

import java.math.BigDecimal;

public record RecommendationCategoryItem(
        Long categoryId,
        String nome,
        BigDecimal valorSugerido,
        boolean baseadoEmHistorico
) {
}
