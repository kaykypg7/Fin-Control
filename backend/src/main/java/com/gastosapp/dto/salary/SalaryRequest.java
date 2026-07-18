package com.gastosapp.dto.salary;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record SalaryRequest(
        @NotNull(message = "Mês de referência é obrigatório")
        @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "Mês de referência deve estar no formato YYYY-MM")
        String mesReferencia,

        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.0", message = "Valor deve ser maior ou igual a zero")
        BigDecimal valor
) {
}
