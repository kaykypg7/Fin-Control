package com.gastosapp.service;

import com.gastosapp.domain.entity.Budget;
import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.entity.Salary;
import com.gastosapp.domain.entity.Transaction;
import com.gastosapp.domain.enums.Grupo503020;
import com.gastosapp.dto.report.CategoryEvolutionItem;
import com.gastosapp.dto.report.CategorySummaryItem;
import com.gastosapp.dto.report.MonthlyComparisonItem;
import com.gastosapp.dto.report.MonthlySummaryResponse;
import com.gastosapp.repository.BudgetRepository;
import com.gastosapp.repository.CategoryRepository;
import com.gastosapp.repository.SalaryRepository;
import com.gastosapp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final SalaryRepository salaryRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public MonthlySummaryResponse summary(Long userId, YearMonth mes) {
        BigDecimal salario = salaryRepository.findByUserIdAndMesReferencia(userId, mes.toString())
                .map(Salary::getValor)
                .orElse(null);

        Map<Long, Category> categoriaPorId = categoryRepository.findByUserIdIsNullOrUserId(userId).stream()
                .collect(Collectors.toMap(Category::getId, c -> c));

        Map<Long, BigDecimal> metasPorCategoria = budgetRepository.findByUserIdAndMesReferencia(userId, mes.toString()).stream()
                .collect(Collectors.toMap(Budget::getCategoryId, Budget::getValorMeta));

        Map<Long, BigDecimal> gastosPorCategoria = transactionRepository
                .findByUserIdAndDataBetween(userId, mes.atDay(1), mes.atEndOfMonth()).stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategoryId,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getValor, BigDecimal::add)));

        Set<Long> idsRelevantes = new LinkedHashSet<>();
        idsRelevantes.addAll(metasPorCategoria.keySet());
        idsRelevantes.addAll(gastosPorCategoria.keySet());

        List<CategorySummaryItem> porCategoria = idsRelevantes.stream()
                .map(id -> {
                    Category cat = categoriaPorId.get(id);
                    String nome = cat != null ? cat.getNome() : "Categoria removida";
                    String cor = cat != null ? cat.getCor() : "#999999";
                    Grupo503020 grupo = cat != null ? cat.getGrupo503020() : null;
                    return new CategorySummaryItem(
                            id, nome, cor, grupo,
                            metasPorCategoria.getOrDefault(id, BigDecimal.ZERO),
                            gastosPorCategoria.getOrDefault(id, BigDecimal.ZERO));
                })
                .sorted(Comparator.comparing(CategorySummaryItem::nome))
                .toList();

        BigDecimal totalMetas = metasPorCategoria.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalGasto = gastosPorCategoria.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return new MonthlySummaryResponse(mes.toString(), salario, totalMetas, totalGasto, porCategoria);
    }

    public List<MonthlyComparisonItem> monthlyComparison(Long userId, YearMonth ate, int meses) {
        List<MonthlyComparisonItem> resultado = new ArrayList<>();
        for (int i = meses - 1; i >= 0; i--) {
            YearMonth mes = ate.minusMonths(i);

            BigDecimal salario = salaryRepository.findByUserIdAndMesReferencia(userId, mes.toString())
                    .map(Salary::getValor)
                    .orElse(null);

            BigDecimal totalMeta = budgetRepository.findByUserIdAndMesReferencia(userId, mes.toString()).stream()
                    .map(Budget::getValorMeta)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalGasto = transactionRepository
                    .findByUserIdAndDataBetween(userId, mes.atDay(1), mes.atEndOfMonth()).stream()
                    .map(Transaction::getValor)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            resultado.add(new MonthlyComparisonItem(mes.toString(), salario, totalMeta, totalGasto));
        }
        return resultado;
    }

    public List<CategoryEvolutionItem> categoryEvolution(Long userId, YearMonth ate, int meses, Long categoryId) {
        List<Category> categorias = categoryId != null
                ? categoryRepository.findById(categoryId).map(List::of).orElse(List.of())
                : categoryRepository.findByUserIdIsNullOrUserId(userId);

        List<CategoryEvolutionItem> resultado = new ArrayList<>();
        for (int i = meses - 1; i >= 0; i--) {
            YearMonth mes = ate.minusMonths(i);
            for (Category cat : categorias) {
                BigDecimal gasto = transactionRepository.sumByUserAndCategoryBetween(
                        userId, cat.getId(), mes.atDay(1), mes.atEndOfMonth());
                resultado.add(new CategoryEvolutionItem(mes.toString(), cat.getId(), cat.getNome(), gasto));
            }
        }
        return resultado;
    }
}
