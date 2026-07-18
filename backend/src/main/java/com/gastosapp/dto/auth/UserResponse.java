package com.gastosapp.dto.auth;

import com.gastosapp.domain.enums.Role;

public record UserResponse(
        Long id,
        String nome,
        String email,
        Role role
) {
}
