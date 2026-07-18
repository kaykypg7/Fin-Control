package com.gastosapp.dto.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BudgetItemRequest(
        @NotNull(message = "Categoria é obrigatória")
        Long categoryId,

        @NotNull(message = "Valor da meta é obrigatório")
        @DecimalMin(value = "0.0", message = "Valor da meta deve ser maior ou igual a zero")
        BigDecimal valorMeta
) {
}
