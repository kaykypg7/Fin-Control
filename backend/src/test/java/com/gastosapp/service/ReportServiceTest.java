package com.gastosapp.service;

import com.gastosapp.domain.entity.Budget;
import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.entity.Salary;
import com.gastosapp.domain.entity.Transaction;
import com.gastosapp.domain.enums.Grupo503020;
import com.gastosapp.dto.report.CategorySummaryItem;
import com.gastosapp.dto.report.MonthlyComparisonItem;
import com.gastosapp.dto.report.MonthlySummaryResponse;
import com.gastosapp.repository.BudgetRepository;
import com.gastosapp.repository.CategoryRepository;
import com.gastosapp.repository.SalaryRepository;
import com.gastosapp.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private SalaryRepository salaryRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private BudgetRepository budgetRepository;
    @Mock
    private TransactionRepository transactionRepository;

    private static final Long USER_ID = 1L;
    private static final YearMonth MES = YearMonth.of(2026, 7);

    private ReportService service() {
        return new ReportService(salaryRepository, categoryRepository, budgetRepository, transactionRepository);
    }

    @Test
    void summaryAgregaMetasEGastosPorCategoriaCorretamente() {
        Category alimentacao = categoriaComId(1L, "Alimentação", Grupo503020.NECESSIDADE);
        Category transporte = categoriaComId(2L, "Transporte", Grupo503020.NECESSIDADE);

        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString()))
                .thenReturn(Optional.of(new Salary(USER_ID, MES.toString(), new BigDecimal("5000.00"))));
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID)).thenReturn(List.of(alimentacao, transporte));
        when(budgetRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString())).thenReturn(List.of(
                new Budget(USER_ID, 1L, MES.toString(), new BigDecimal("600.00")),
                new Budget(USER_ID, 2L, MES.toString(), new BigDecimal("400.00"))
        ));
        when(transactionRepository.findByUserIdAndDataBetween(USER_ID, MES.atDay(1), MES.atEndOfMonth())).thenReturn(List.of(
                new Transaction(USER_ID, 1L, new BigDecimal("300.00"), LocalDate.of(2026, 7, 5), "Mercado"),
                new Transaction(USER_ID, 1L, new BigDecimal("150.00"), LocalDate.of(2026, 7, 12), "Restaurante"),
                new Transaction(USER_ID, 2L, new BigDecimal("500.00"), LocalDate.of(2026, 7, 8), "Combustível")
        ));

        MonthlySummaryResponse resposta = service().summary(USER_ID, MES);

        assertThat(resposta.salario()).isEqualByComparingTo("5000.00");
        assertThat(resposta.totalMetas()).isEqualByComparingTo("1000.00");
        assertThat(resposta.totalGasto()).isEqualByComparingTo("950.00");

        CategorySummaryItem alimentacaoItem = resposta.porCategoria().stream()
                .filter(c -> c.categoryId().equals(1L)).findFirst().orElseThrow();
        assertThat(alimentacaoItem.valorGasto()).isEqualByComparingTo("450.00");
        assertThat(alimentacaoItem.valorMeta()).isEqualByComparingTo("600.00");

        CategorySummaryItem transporteItem = resposta.porCategoria().stream()
                .filter(c -> c.categoryId().equals(2L)).findFirst().orElseThrow();
        assertThat(transporteItem.valorGasto()).isEqualByComparingTo("500.00");
    }

    @Test
    void summarySemSalarioDefinidoRetornaSalarioNulo() {
        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString())).thenReturn(Optional.empty());
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID)).thenReturn(List.of());
        when(budgetRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString())).thenReturn(List.of());
        when(transactionRepository.findByUserIdAndDataBetween(USER_ID, MES.atDay(1), MES.atEndOfMonth())).thenReturn(List.of());

        MonthlySummaryResponse resposta = service().summary(USER_ID, MES);

        assertThat(resposta.salario()).isNull();
        assertThat(resposta.totalMetas()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(resposta.totalGasto()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void monthlyComparisonRetornaUmItemPorMesNaOrdemCronologica() {
        when(salaryRepository.findByUserIdAndMesReferencia(anyLong(), any())).thenReturn(Optional.empty());
        when(budgetRepository.findByUserIdAndMesReferencia(anyLong(), any())).thenReturn(List.of());
        when(transactionRepository.findByUserIdAndDataBetween(anyLong(), any(), any())).thenReturn(List.of());

        List<MonthlyComparisonItem> resultado = service().monthlyComparison(USER_ID, MES, 3);

        assertThat(resultado).hasSize(3);
        assertThat(resultado.get(0).mesReferencia()).isEqualTo("2026-05");
        assertThat(resultado.get(1).mesReferencia()).isEqualTo("2026-06");
        assertThat(resultado.get(2).mesReferencia()).isEqualTo("2026-07");
    }

    private static Category categoriaComId(Long id, String nome, Grupo503020 grupo) {
        Category category = mock(Category.class);
        when(category.getId()).thenReturn(id);
        when(category.getNome()).thenReturn(nome);
        return category;
    }
}
