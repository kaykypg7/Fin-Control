package com.gastosapp.service;

import com.gastosapp.domain.entity.Category;
import com.gastosapp.dto.category.CategoryRequest;
import com.gastosapp.dto.category.CategoryResponse;
import com.gastosapp.exception.AccessDeniedApiException;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /** Categorias visiveis para o usuario: padrao do sistema (userId null) + proprias. */
    public List<CategoryResponse> listForUser(Long userId) {
        return categoryRepository.findByUserIdIsNullOrUserId(userId).stream()
                .sorted(Comparator.comparing(Category::getNome))
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        Category category = new Category(
                userId, request.nome(), request.tipo(), request.grupo503020(), request.cor(), request.icone());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long userId, Long categoryId, CategoryRequest request) {
        Category category = findOwnedByUser(userId, categoryId);
        category.setNome(request.nome());
        category.setTipo(request.tipo());
        category.setGrupo503020(request.grupo503020());
        category.setCor(request.cor());
        category.setIcone(request.icone());
        return CategoryResponse.from(category);
    }

    @Transactional
    public void delete(Long userId, Long categoryId) {
        Category category = findOwnedByUser(userId, categoryId);
        categoryRepository.delete(category);
    }

    private Category findOwnedByUser(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        if (category.isSystemDefault() || !category.getUserId().equals(userId)) {
            throw new AccessDeniedApiException("Você não pode alterar esta categoria");
        }
        return category;
    }
}
