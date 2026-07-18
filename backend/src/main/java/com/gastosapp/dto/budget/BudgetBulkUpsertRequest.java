package com.gastosapp.dto.budget;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record BudgetBulkUpsertRequest(
        @NotNull(message = "Mês de referência é obrigatório")
        @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "Mês de referência deve estar no formato YYYY-MM")
        String mesReferencia,

        @NotEmpty(message = "Informe ao menos uma meta")
        @Valid
        List<BudgetItemRequest> itens
) {
}
