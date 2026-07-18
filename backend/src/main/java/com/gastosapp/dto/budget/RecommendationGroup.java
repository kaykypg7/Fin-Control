package com.gastosapp.dto.budget;

import com.gastosapp.domain.enums.Grupo503020;

import java.math.BigDecimal;
import java.util.List;

public record RecommendationGroup(
        Grupo503020 grupo,
        BigDecimal valorAlocado,
        List<RecommendationCategoryItem> categorias
) {
}
