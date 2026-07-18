package com.gastosapp.service;

import com.gastosapp.domain.entity.Transaction;
import com.gastosapp.dto.transaction.TransactionRequest;
import com.gastosapp.dto.transaction.TransactionResponse;
import com.gastosapp.exception.AccessDeniedApiException;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<TransactionResponse> list(Long userId, YearMonth mes, Long categoryId) {
        List<Transaction> transactions = categoryId == null
                ? transactionRepository.findByUserIdAndDataBetween(userId, mes.atDay(1), mes.atEndOfMonth())
                : transactionRepository.findByUserIdAndCategoryIdAndDataBetween(
                        userId, categoryId, mes.atDay(1), mes.atEndOfMonth());

        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::getData).reversed())
                .map(TransactionResponse::from)
                .toList();
    }

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        Transaction transaction = new Transaction(
                userId, request.categoryId(), request.valor(), request.data(), request.descricao());
        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = findOwnedByUser(userId, transactionId);
        transaction.setCategoryId(request.categoryId());
        transaction.setValor(request.valor());
        transaction.setData(request.data());
        transaction.setDescricao(request.descricao());
        return TransactionResponse.from(transaction);
    }

    @Transactional
    public void delete(Long userId, Long transactionId) {
        Transaction transaction = findOwnedByUser(userId, transactionId);
        transactionRepository.delete(transaction);
    }

    private Transaction findOwnedByUser(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Lançamento não encontrado"));
        if (!transaction.getUserId().equals(userId)) {
            throw new AccessDeniedApiException("Você não pode alterar este lançamento");
        }
        return transaction;
    }
}
