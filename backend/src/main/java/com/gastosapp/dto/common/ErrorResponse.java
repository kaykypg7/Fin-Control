package com.gastosapp.dto.common;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        String code,
        String message,
        LocalDateTime timestamp,
        List<FieldErrorItem> fieldErrors
) {
    public static ErrorResponse of(String code, String message) {
        return new ErrorResponse(code, message, LocalDateTime.now(), List.of());
    }

    public static ErrorResponse of(String code, String message, List<FieldErrorItem> fieldErrors) {
        return new ErrorResponse(code, message, LocalDateTime.now(), fieldErrors);
    }
}
