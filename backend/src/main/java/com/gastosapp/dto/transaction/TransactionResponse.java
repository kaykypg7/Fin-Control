package com.gastosapp.dto.transaction;

import com.gastosapp.domain.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        Long categoryId,
        BigDecimal valor,
        LocalDate data,
        String descricao
) {
    public static TransactionResponse from(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getCategoryId(),
                transaction.getValor(),
                transaction.getData(),
                transaction.getDescricao());
    }
}
