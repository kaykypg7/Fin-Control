package com.gastosapp.dto.admin;

import com.gastosapp.domain.enums.Role;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String nome,
        String email,
        Role role,
        LocalDateTime createdAt,
        long totalLancamentos
) {
}
