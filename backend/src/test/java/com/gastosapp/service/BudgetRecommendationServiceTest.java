package com.gastosapp.service;

import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.entity.Salary;
import com.gastosapp.domain.enums.Grupo503020;
import com.gastosapp.dto.budget.BudgetRecommendationResponse;
import com.gastosapp.dto.budget.RecommendationCategoryItem;
import com.gastosapp.dto.budget.RecommendationGroup;
import com.gastosapp.exception.BusinessRuleException;
import com.gastosapp.repository.CategoryRepository;
import com.gastosapp.repository.SalaryRepository;
import com.gastosapp.repository.TransactionRepository;
import com.gastosapp.service.BudgetRecommendationService.CategoriaComHistorico;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetRecommendationServiceTest {

    @Mock
    private SalaryRepository salaryRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private TransactionRepository transactionRepository;

    private static final Long USER_ID = 1L;
    private static final YearMonth MES = YearMonth.of(2026, 7);

    // ---- calcularDistribuicao: pure-function unit tests (no Spring, no mocks) ----

    @Test
    void proporcionalAoHistoricoSomaExatamenteAoTotalDoGrupo() {
        List<CategoriaComHistorico> categorias = List.of(
                new CategoriaComHistorico(1L, "Alimentação", new BigDecimal("700.00")),
                new CategoriaComHistorico(2L, "Transporte", new BigDecimal("200.00")),
                new CategoriaComHistorico(3L, "Saúde", new BigDecimal("100.00"))
        );
        BigDecimal totalGrupo = new BigDecimal("1000.00");

        List<RecommendationCategoryItem> resultado = BudgetRecommendationService.calcularDistribuicao(categorias, totalGrupo);

        assertThat(resultado).allMatch(RecommendationCategoryItem::baseadoEmHistorico);
        BigDecimal soma = resultado.stream().map(RecommendationCategoryItem::valorSugerido).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertThat(soma).isEqualByComparingTo(totalGrupo);
        assertThat(resultado.get(0).valorSugerido()).isEqualByComparingTo("700.00");
        assertThat(resultado.get(1).valorSugerido()).isEqualByComparingTo("200.00");
        assertThat(resultado.get(2).valorSugerido()).isEqualByComparingTo("100.00");
    }

    @Test
    void semHistoricoDivideIgualmenteEntreCategorias() {
        List<CategoriaComHistorico> categorias = List.of(
                new CategoriaComHistorico(1L, "Lazer", BigDecimal.ZERO),
                new CategoriaComHistorico(2L, "Cartão de Crédito", BigDecimal.ZERO)
        );
        BigDecimal totalGrupo = new BigDecimal("300.00");

        List<RecommendationCategoryItem> resultado = BudgetRecommendationService.calcularDistribuicao(categorias, totalGrupo);

        assertThat(resultado).noneMatch(RecommendationCategoryItem::baseadoEmHistorico);
        assertThat(resultado.get(0).valorSugerido()).isEqualByComparingTo("150.00");
        assertThat(resultado.get(1).valorSugerido()).isEqualByComparingTo("150.00");
    }

    @Test
    void historicoTodoZeroCaiParaDivisaoIgualitaria() {
        List<CategoriaComHistorico> categorias = List.of(
                new CategoriaComHistorico(1L, "A", BigDecimal.ZERO),
                new CategoriaComHistorico(2L, "B", BigDecimal.ZERO),
                new CategoriaComHistorico(3L, "C", BigDecimal.ZERO)
        );
        BigDecimal totalGrupo = new BigDecimal("100.00");

        List<RecommendationCategoryItem> resultado = BudgetRecommendationService.calcularDistribuicao(categorias, totalGrupo);

        BigDecimal soma = resultado.stream().map(RecommendationCategoryItem::valorSugerido).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertThat(soma).isEqualByComparingTo(totalGrupo);
        // 100/3 = 33.33... - o metodo do maior resto deve distribuir os centavos restantes
        assertThat(resultado).extracting(RecommendationCategoryItem::valorSugerido)
                .containsExactlyInAnyOrder(new BigDecimal("33.34"), new BigDecimal("33.33"), new BigDecimal("33.33"));
    }

    @Test
    void categoriaUnicaRecebeCemPorCentoDoGrupo() {
        List<CategoriaComHistorico> categorias = List.of(
                new CategoriaComHistorico(1L, "Poupança", new BigDecimal("50.00")));
        BigDecimal totalGrupo = new BigDecimal("400.00");

        List<RecommendationCategoryItem> resultado = BudgetRecommendationService.calcularDistribuicao(categorias, totalGrupo);

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).valorSugerido()).isEqualByComparingTo(totalGrupo);
    }

    @Test
    void salarioNaoDivisivelPorTresAindaSomaExatamenteAoCentavo() {
        List<CategoriaComHistorico> categorias = List.of(
                new CategoriaComHistorico(1L, "A", BigDecimal.ZERO),
                new CategoriaComHistorico(2L, "B", BigDecimal.ZERO),
                new CategoriaComHistorico(3L, "C", BigDecimal.ZERO),
                new CategoriaComHistorico(4L, "D", BigDecimal.ZERO),
                new CategoriaComHistorico(5L, "E", BigDecimal.ZERO),
                new CategoriaComHistorico(6L, "F", BigDecimal.ZERO),
                new CategoriaComHistorico(7L, "G", BigDecimal.ZERO)
        );
        BigDecimal totalGrupo = new BigDecimal("333.37");

        List<RecommendationCategoryItem> resultado = BudgetRecommendationService.calcularDistribuicao(categorias, totalGrupo);

        BigDecimal soma = resultado.stream().map(RecommendationCategoryItem::valorSugerido).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertThat(soma).isEqualByComparingTo(totalGrupo);
    }

    @Test
    void grupoVazioRetornaListaVazia() {
        List<RecommendationCategoryItem> resultado =
                BudgetRecommendationService.calcularDistribuicao(List.of(), new BigDecimal("500.00"));
        assertThat(resultado).isEmpty();
    }

    // ---- recommend(): integration with mocked repositories ----

    @Test
    void semSalarioLancaBusinessRuleException() {
        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString())).thenReturn(Optional.empty());
        when(salaryRepository.findTopByUserIdOrderByMesReferenciaDesc(USER_ID)).thenReturn(Optional.empty());

        BudgetRecommendationService service = new BudgetRecommendationService(
                salaryRepository, categoryRepository, transactionRepository);

        assertThatThrownBy(() -> service.recommend(USER_ID, MES))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("code", "SALARY_NOT_SET");
    }

    @Test
    void grupoSemCategoriasEhReportadoEmNaoAlocado() {
        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString()))
                .thenReturn(Optional.of(new Salary(USER_ID, MES.toString(), new BigDecimal("1000.00"))));
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID)).thenReturn(List.of());

        BudgetRecommendationService service = new BudgetRecommendationService(
                salaryRepository, categoryRepository, transactionRepository);

        BudgetRecommendationResponse resposta = service.recommend(USER_ID, MES);

        assertThat(resposta.naoAlocado()).isEqualByComparingTo("1000.00");
        assertThat(resposta.avisos()).hasSize(3);
        assertThat(resposta.grupos()).allMatch(g -> g.categorias().isEmpty());
    }

    @Test
    void semSalarioNoMesUsaUltimoSalarioConhecido() {
        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString())).thenReturn(Optional.empty());
        when(salaryRepository.findTopByUserIdOrderByMesReferenciaDesc(USER_ID))
                .thenReturn(Optional.of(new Salary(USER_ID, "2026-06", new BigDecimal("2000.00"))));
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID)).thenReturn(List.of());

        BudgetRecommendationService service = new BudgetRecommendationService(
                salaryRepository, categoryRepository, transactionRepository);

        BudgetRecommendationResponse resposta = service.recommend(USER_ID, MES);

        assertThat(resposta.salarioBase()).isEqualByComparingTo("2000.00");
    }

    @Test
    void categoriasComHistoricoRecebemDistribuicaoProporcionalNaResposta() {
        Category alimentacao = categoriaComId(1L, "Alimentação", Grupo503020.NECESSIDADE);
        Category lazer = categoriaComId(2L, "Lazer", Grupo503020.DESEJO);
        Category poupanca = categoriaComId(3L, "Poupança", Grupo503020.POUPANCA);

        when(salaryRepository.findByUserIdAndMesReferencia(USER_ID, MES.toString()))
                .thenReturn(Optional.of(new Salary(USER_ID, MES.toString(), new BigDecimal("3000.00"))));
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID))
                .thenReturn(List.of(alimentacao, lazer, poupanca));
        when(transactionRepository.sumByUserAndCategoryBetween(eq(USER_ID), anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.ZERO);

        BudgetRecommendationService service = new BudgetRecommendationService(
                salaryRepository, categoryRepository, transactionRepository);

        BudgetRecommendationResponse resposta = service.recommend(USER_ID, MES);

        assertThat(resposta.naoAlocado()).isEqualByComparingTo("0.00");
        RecommendationGroup necessidade = resposta.grupos().stream()
                .filter(g -> g.grupo() == Grupo503020.NECESSIDADE).findFirst().orElseThrow();
        assertThat(necessidade.valorAlocado()).isEqualByComparingTo("1500.00");
        assertThat(necessidade.categorias()).hasSize(1);
        assertThat(necessidade.categorias().get(0).valorSugerido()).isEqualByComparingTo("1500.00");
    }

    private static Category categoriaComId(Long id, String nome, Grupo503020 grupo) {
        Category category = mock(Category.class);
        when(category.getId()).thenReturn(id);
        when(category.getNome()).thenReturn(nome);
        when(category.getGrupo503020()).thenReturn(grupo);
        return category;
    }
}
