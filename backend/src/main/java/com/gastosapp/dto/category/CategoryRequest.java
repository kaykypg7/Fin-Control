package com.gastosapp.dto.category;

import com.gastosapp.domain.enums.CategoryTipo;
import com.gastosapp.domain.enums.Grupo503020;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 80, message = "Nome deve ter no máximo 80 caracteres")
        String nome,

        @NotNull(message = "Tipo é obrigatório")
        CategoryTipo tipo,

        @NotNull(message = "Grupo 50/30/20 é obrigatório")
        Grupo503020 grupo503020,

        @NotBlank(message = "Cor é obrigatória")
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Cor deve estar no formato hexadecimal, ex: #FF0000")
        String cor,

        @NotBlank(message = "Ícone é obrigatório")
        @Size(max = 50, message = "Ícone deve ter no máximo 50 caracteres")
        String icone
) {
}
