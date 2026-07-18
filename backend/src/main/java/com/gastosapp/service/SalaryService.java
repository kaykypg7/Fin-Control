package com.gastosapp.service;

import com.gastosapp.domain.entity.Salary;
import com.gastosapp.dto.salary.SalaryRequest;
import com.gastosapp.dto.salary.SalaryResponse;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final SalaryRepository salaryRepository;

    public SalaryResponse getCurrent(Long userId) {
        String currentMonth = YearMonth.now().format(MONTH_FORMAT);
        return salaryRepository.findByUserIdAndMesReferencia(userId, currentMonth)
                .map(SalaryResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Nenhum salário definido para o mês " + currentMonth));
    }

    @Transactional
    public SalaryResponse upsert(Long userId, SalaryRequest request) {
        Salary salary = salaryRepository.findByUserIdAndMesReferencia(userId, request.mesReferencia())
                .orElseGet(() -> new Salary(userId, request.mesReferencia(), request.valor()));
        salary.setValor(request.valor());
        return SalaryResponse.from(salaryRepository.save(salary));
    }
}
