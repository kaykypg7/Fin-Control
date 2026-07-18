package com.gastosapp.service;

import com.gastosapp.domain.entity.Budget;
import com.gastosapp.dto.budget.BudgetBulkUpsertRequest;
import com.gastosapp.dto.budget.BudgetItemRequest;
import com.gastosapp.dto.budget.BudgetResponse;
import com.gastosapp.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public List<BudgetResponse> getByMonth(Long userId, String mesReferencia) {
        return budgetRepository.findByUserIdAndMesReferencia(userId, mesReferencia).stream()
                .map(BudgetResponse::from)
                .toList();
    }

    @Transactional
    public List<BudgetResponse> bulkUpsert(Long userId, BudgetBulkUpsertRequest request) {
        return request.itens().stream()
                .map(item -> upsertOne(userId, request.mesReferencia(), item))
                .map(BudgetResponse::from)
                .toList();
    }

    private Budget upsertOne(Long userId, String mesReferencia, BudgetItemRequest item) {
        Budget budget = budgetRepository
                .findByUserIdAndCategoryIdAndMesReferencia(userId, item.categoryId(), mesReferencia)
                .orElseGet(() -> new Budget(userId, item.categoryId(), mesReferencia, item.valorMeta()));
        budget.setValorMeta(item.valorMeta());
        return budgetRepository.save(budget);
    }
}
