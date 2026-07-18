package com.gastosapp.dto.auth;

public record AuthResponse(
        String token,
        UserResponse usuario
) {
}
