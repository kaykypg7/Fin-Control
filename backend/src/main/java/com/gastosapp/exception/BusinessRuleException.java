package com.gastosapp.exception;

import org.springframework.http.HttpStatus;

/** Violação de uma regra de negócio (ex.: recomendação sem salário definido). Mapeada para 422. */
public class BusinessRuleException extends ApiException {

    public BusinessRuleException(String code, String message) {
        super(code, message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
