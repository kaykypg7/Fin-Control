package com.gastosapp.dto.category;

import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.enums.CategoryTipo;
import com.gastosapp.domain.enums.Grupo503020;

public record CategoryResponse(
        Long id,
        String nome,
        CategoryTipo tipo,
        Grupo503020 grupo503020,
        String cor,
        String icone,
        boolean sistemaPadrao
) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getNome(),
                category.getTipo(),
                category.getGrupo503020(),
                category.getCor(),
                category.getIcone(),
                category.isSystemDefault());
    }
}
