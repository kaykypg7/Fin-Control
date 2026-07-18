package com.gastosapp.dto.budget;

import com.gastosapp.domain.entity.Budget;

import java.math.BigDecimal;

public record BudgetResponse(
        Long id,
        Long categoryId,
        String mesReferencia,
        BigDecimal valorMeta
) {
    public static BudgetResponse from(Budget budget) {
        return new BudgetResponse(budget.getId(), budget.getCategoryId(), budget.getMesReferencia(), budget.getValorMeta());
    }
}
