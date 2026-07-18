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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * Distribui o salario entre grupos NECESSIDADE (50%) / DESEJO (30%) / POUPANCA (20%) e,
 * dentro de cada grupo, entre as categorias, proporcionalmente ao historico de gastos dos
 * ultimos {@link #HISTORY_MONTHS} meses (ou igualmente, se nao houver historico).
 */
@Service
@RequiredArgsConstructor
public class BudgetRecommendationService {

    static final int HISTORY_MONTHS = 3;
    private static final BigDecimal NECESSIDADE_PCT = new BigDecimal("0.50");
    private static final BigDecimal DESEJO_PCT = new BigDecimal("0.30");
    private static final BigDecimal POUPANCA_PCT = new BigDecimal("0.20");
    private static final BigDecimal CENTAVO = new BigDecimal("0.01");

    private final SalaryRepository salaryRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetRecommendationResponse recommend(Long userId, YearMonth mes) {
        BigDecimal salario = resolveSalario(userId, mes);

        Map<Grupo503020, List<Category>> porGrupo = categoryRepository.findByUserIdIsNullOrUserId(userId).stream()
                .collect(Collectors.groupingBy(Category::getGrupo503020, LinkedHashMap::new, Collectors.toList()));

        YearMonth inicioHistorico = mes.minusMonths(HISTORY_MONTHS);
        YearMonth fimHistorico = mes.minusMonths(1);

        List<String> avisos = new ArrayList<>();
        List<RecommendationGroup> grupos = new ArrayList<>();
        BigDecimal naoAlocado = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (Grupo503020 grupo : Grupo503020.values()) {
            BigDecimal totalGrupo = alvoDoGrupo(salario, grupo);
            List<Category> categoriasDoGrupo = porGrupo.getOrDefault(grupo, List.of());

            if (categoriasDoGrupo.isEmpty()) {
                naoAlocado = naoAlocado.add(totalGrupo);
                avisos.add("Nenhuma categoria no grupo " + grupo + "; R$ " + totalGrupo + " não alocado.");
                grupos.add(new RecommendationGroup(grupo, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP), List.of()));
                continue;
            }

            List<CategoriaComHistorico> comHistorico = categoriasDoGrupo.stream()
                    .map(cat -> new CategoriaComHistorico(
                            cat.getId(),
                            cat.getNome(),
                            transactionRepository.sumByUserAndCategoryBetween(
                                    userId, cat.getId(), inicioHistorico.atDay(1), fimHistorico.atEndOfMonth())))
                    .toList();

            grupos.add(new RecommendationGroup(grupo, totalGrupo, calcularDistribuicao(comHistorico, totalGrupo)));
        }

        return new BudgetRecommendationResponse(mes.toString(), salario, grupos, naoAlocado, avisos);
    }

    private BigDecimal resolveSalario(Long userId, YearMonth mes) {
        return salaryRepository.findByUserIdAndMesReferencia(userId, mes.toString())
                .or(() -> salaryRepository.findTopByUserIdOrderByMesReferenciaDesc(userId))
                .map(Salary::getValor)
                .orElseThrow(() -> new BusinessRuleException(
                        "SALARY_NOT_SET", "Defina seu salário antes de gerar uma recomendação"));
    }

    private static BigDecimal alvoDoGrupo(BigDecimal salario, Grupo503020 grupo) {
        BigDecimal percentual = switch (grupo) {
            case NECESSIDADE -> NECESSIDADE_PCT;
            case DESEJO -> DESEJO_PCT;
            case POUPANCA -> POUPANCA_PCT;
        };
        return salario.multiply(percentual).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Divide {@code totalGrupo} entre as categorias, proporcionalmente ao historico (ou
     * igualmente se nao houver historico), e corrige o arredondamento pelo metodo do maior
     * resto para que a soma dos valores sugeridos seja exatamente {@code totalGrupo}.
     * Funcao pura, sem dependencia do Spring, para ser testada isoladamente.
     */
    static List<RecommendationCategoryItem> calcularDistribuicao(
            List<CategoriaComHistorico> categorias, BigDecimal totalGrupo) {
        int n = categorias.size();
        if (n == 0) {
            return List.of();
        }

        BigDecimal historicoTotal = categorias.stream()
                .map(CategoriaComHistorico::historico)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        boolean baseadoEmHistorico = historicoTotal.compareTo(BigDecimal.ZERO) > 0;

        List<BigDecimal> valoresBrutos = categorias.stream()
                .map(cat -> {
                    BigDecimal peso = baseadoEmHistorico
                            ? cat.historico().divide(historicoTotal, 10, RoundingMode.HALF_UP)
                            : BigDecimal.ONE.divide(BigDecimal.valueOf(n), 10, RoundingMode.HALF_UP);
                    return totalGrupo.multiply(peso);
                })
                .toList();

        List<BigDecimal> valoresAjustados = ajustarArredondamento(valoresBrutos, totalGrupo);

        List<RecommendationCategoryItem> itens = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            CategoriaComHistorico cat = categorias.get(i);
            itens.add(new RecommendationCategoryItem(
                    cat.categoryId(), cat.nome(), valoresAjustados.get(i), baseadoEmHistorico));
        }
        return itens;
    }

    /** Metodo do maior resto: arredonda cada valor para baixo e distribui os centavos
     * restantes, um a um, para as categorias com maior parte fracionaria descartada. */
    private static List<BigDecimal> ajustarArredondamento(List<BigDecimal> valoresBrutos, BigDecimal totalGrupo) {
        int n = valoresBrutos.size();
        List<BigDecimal> pisos = new ArrayList<>();
        List<BigDecimal> restos = new ArrayList<>();
        for (BigDecimal bruto : valoresBrutos) {
            BigDecimal piso = bruto.setScale(2, RoundingMode.DOWN);
            pisos.add(piso);
            restos.add(bruto.subtract(piso));
        }

        BigDecimal somaPisos = pisos.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        long centavosRestantes = totalGrupo.subtract(somaPisos)
                .movePointRight(2)
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        List<Integer> indicesPorMaiorResto = IntStream.range(0, n).boxed()
                .sorted(Comparator.comparing((Integer i) -> restos.get(i)).reversed())
                .toList();

        List<BigDecimal> resultado = new ArrayList<>(pisos);
        for (int i = 0; i < centavosRestantes; i++) {
            int idx = indicesPorMaiorResto.get(i % n);
            resultado.set(idx, resultado.get(idx).add(CENTAVO));
        }
        return resultado;
    }

    record CategoriaComHistorico(Long categoryId, String nome, BigDecimal historico) {
    }
}
