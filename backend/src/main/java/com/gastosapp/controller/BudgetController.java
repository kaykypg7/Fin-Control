package com.gastosapp.controller;

import com.gastosapp.dto.budget.BudgetBulkUpsertRequest;
import com.gastosapp.dto.budget.BudgetRecommendationResponse;
import com.gastosapp.dto.budget.BudgetResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.BudgetRecommendationService;
import com.gastosapp.service.BudgetService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@Validated
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final BudgetRecommendationService recommendationService;

    @GetMapping
    public List<BudgetResponse> getByMonth(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "month deve estar no formato YYYY-MM") String month
    ) {
        return budgetService.getByMonth(user.getUserId(), month);
    }

    @PostMapping
    public List<BudgetResponse> bulkUpsert(
            @CurrentUser AuthenticatedUser user, @Valid @RequestBody BudgetBulkUpsertRequest request) {
        return budgetService.bulkUpsert(user.getUserId(), request);
    }

    @PostMapping("/recommend")
    public BudgetRecommendationResponse recommend(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "month deve estar no formato YYYY-MM") String month
    ) {
        return recommendationService.recommend(user.getUserId(), YearMonth.parse(month));
    }
}
