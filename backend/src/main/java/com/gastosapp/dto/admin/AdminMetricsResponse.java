package com.gastosapp.dto.admin;

import java.math.BigDecimal;

/**
 * Metricas agregadas de uso do sistema. Deliberadamente nao expoe nenhum valor financeiro
 * individual de usuario (saldo, gasto, meta) - apenas contagens e medias, para que o admin
 * possa observar o uso sem acessar os dados financeiros pessoais de outra pessoa.
 */
public record AdminMetricsResponse(
        long totalUsuarios,
        long totalCategoriasSistema,
        long totalLancamentos,
        BigDecimal mediaLancamentosPorUsuario
) {
}
