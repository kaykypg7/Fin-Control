package com.gastosapp.controller;

import com.gastosapp.dto.transaction.TransactionRequest;
import com.gastosapp.dto.transaction.TransactionResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@Validated
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<TransactionResponse> list(
            @CurrentUser AuthenticatedUser user,
            @RequestParam @Pattern(regexp = "^\\d{4}-(0[1-9]|1[0-2])$", message = "month deve estar no formato YYYY-MM") String month,
            @RequestParam(required = false) Long categoryId
    ) {
        return transactionService.list(user.getUserId(), YearMonth.parse(month), categoryId);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @CurrentUser AuthenticatedUser user, @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(user.getUserId(), request));
    }

    @PutMapping("/{id}")
    public TransactionResponse update(
            @CurrentUser AuthenticatedUser user, @PathVariable Long id, @Valid @RequestBody TransactionRequest request) {
        return transactionService.update(user.getUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser AuthenticatedUser user, @PathVariable Long id) {
        transactionService.delete(user.getUserId(), id);
        return ResponseEntity.noContent().build();
    }
}
