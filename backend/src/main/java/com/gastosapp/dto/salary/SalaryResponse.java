package com.gastosapp.dto.salary;

import com.gastosapp.domain.entity.Salary;

import java.math.BigDecimal;

public record SalaryResponse(
        Long id,
        String mesReferencia,
        BigDecimal valor
) {
    public static SalaryResponse from(Salary salary) {
        return new SalaryResponse(salary.getId(), salary.getMesReferencia(), salary.getValor());
    }
}
