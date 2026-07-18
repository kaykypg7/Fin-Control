package com.gastosapp.controller;

import com.gastosapp.dto.salary.SalaryRequest;
import com.gastosapp.dto.salary.SalaryResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.SalaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping("/current")
    public SalaryResponse current(@CurrentUser AuthenticatedUser user) {
        return salaryService.getCurrent(user.getUserId());
    }

    @PostMapping
    public ResponseEntity<SalaryResponse> upsert(
            @CurrentUser AuthenticatedUser user, @Valid @RequestBody SalaryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salaryService.upsert(user.getUserId(), request));
    }
}
