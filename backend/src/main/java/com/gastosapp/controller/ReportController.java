package com.gastosapp.controller;

import com.gastosapp.dto.report.CategoryEvolutionItem;
import com.gastosapp.dto.report.MonthlyComparisonItem;
import com.gastosapp.dto.report.MonthlySummaryResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.ReportService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Validated
@RequiredArgsConstructor
public class ReportController {

    private static final String MONTH_REGEX = "^\\d{4}-(0[1-9]|1[0-2])$";

    private final ReportService reportService;

    @GetMapping("/summary")
    public MonthlySummaryResponse summary(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @Pattern(regexp = MONTH_REGEX, message = "month deve estar no formato YYYY-MM") String month
    ) {
        return reportService.summary(user.getUserId(), YearMonth.parse(month));
    }

    @GetMapping("/monthly-comparison")
    public List<MonthlyComparisonItem> monthlyComparison(
            @CurrentUser AuthenticatedUser user,
            @RequestParam(required = false) @Pattern(regexp = MONTH_REGEX, message = "until deve estar no formato YYYY-MM") String until,
            @RequestParam(defaultValue = "6") @Min(1) @Max(24) int months
    ) {
        YearMonth ate = until != null ? YearMonth.parse(until) : YearMonth.now();
        return reportService.monthlyComparison(user.getUserId(), ate, months);
    }

    @GetMapping("/category-evolution")
    public List<CategoryEvolutionItem> categoryEvolution(
            @CurrentUser AuthenticatedUser user,
            @RequestParam(required = false) @Pattern(regexp = MONTH_REGEX, message = "until deve estar no formato YYYY-MM") String until,
            @RequestParam(defaultValue = "6") @Min(1) @Max(24) int months,
            @RequestParam(required = false) Long categoryId
    ) {
        YearMonth ate = until != null ? YearMonth.parse(until) : YearMonth.now();
        return reportService.categoryEvolution(user.getUserId(), ate, months, categoryId);
    }
}
