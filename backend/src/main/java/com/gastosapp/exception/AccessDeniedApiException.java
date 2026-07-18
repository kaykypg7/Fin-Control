package com.gastosapp.exception;

import org.springframework.http.HttpStatus;

public class AccessDeniedApiException extends ApiException {

    public AccessDeniedApiException(String message) {
        super("ACCESS_DENIED", message, HttpStatus.FORBIDDEN);
    }
}
