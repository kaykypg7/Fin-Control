package com.gastosapp.service;

import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.entity.User;
import com.gastosapp.dto.admin.AdminMetricsResponse;
import com.gastosapp.dto.admin.AdminUserResponse;
import com.gastosapp.dto.category.CategoryRequest;
import com.gastosapp.dto.category.CategoryResponse;
import com.gastosapp.exception.AccessDeniedApiException;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.CategoryRepository;
import com.gastosapp.repository.TransactionRepository;
import com.gastosapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Operacoes administrativas. Deliberadamente NAO expoe nenhum metodo que leia salario, meta
 * ou lancamento individual de outro usuario - apenas contagens agregadas - para preservar a
 * privacidade financeira mesmo para o admin.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    public List<CategoryResponse> listSystemCategories() {
        return categoryRepository.findByUserIdIsNull().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse createSystemCategory(CategoryRequest request) {
        Category category = new Category(
                null, request.nome(), request.tipo(), request.grupo503020(), request.cor(), request.icone());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateSystemCategory(Long categoryId, CategoryRequest request) {
        Category category = findSystemCategory(categoryId);
        category.setNome(request.nome());
        category.setTipo(request.tipo());
        category.setGrupo503020(request.grupo503020());
        category.setCor(request.cor());
        category.setIcone(request.icone());
        return CategoryResponse.from(category);
    }

    @Transactional
    public void deleteSystemCategory(Long categoryId) {
        categoryRepository.delete(findSystemCategory(categoryId));
    }

    public AdminMetricsResponse metrics() {
        long totalUsuarios = userRepository.count();
        long totalCategoriasSistema = categoryRepository.findByUserIdIsNull().size();
        long totalLancamentos = transactionRepository.count();
        BigDecimal mediaLancamentosPorUsuario = totalUsuarios > 0
                ? BigDecimal.valueOf(totalLancamentos).divide(BigDecimal.valueOf(totalUsuarios), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new AdminMetricsResponse(totalUsuarios, totalCategoriasSistema, totalLancamentos, mediaLancamentosPorUsuario);
    }

    private Category findSystemCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        if (!category.isSystemDefault()) {
            throw new AccessDeniedApiException("Esta categoria não é uma categoria padrão do sistema");
        }
        return category;
    }

    private AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                transactionRepository.countByUserId(user.getId()));
    }
}
