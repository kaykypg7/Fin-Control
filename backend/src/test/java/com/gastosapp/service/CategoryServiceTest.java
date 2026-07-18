package com.gastosapp.service;

import com.gastosapp.domain.entity.Category;
import com.gastosapp.domain.enums.CategoryTipo;
import com.gastosapp.domain.enums.Grupo503020;
import com.gastosapp.dto.category.CategoryRequest;
import com.gastosapp.dto.category.CategoryResponse;
import com.gastosapp.exception.AccessDeniedApiException;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private static final Long USER_ID = 1L;
    private static final Long OTHER_USER_ID = 2L;

    @Test
    void listaMergeaCategoriasDoSistemaComAsProprias() {
        Category sistema = mock(Category.class);
        Category propria = mock(Category.class);
        when(sistema.getNome()).thenReturn("Alimentação");
        when(propria.getNome()).thenReturn("Hobby");
        when(categoryRepository.findByUserIdIsNullOrUserId(USER_ID)).thenReturn(List.of(sistema, propria));

        List<CategoryResponse> resultado = categoryService.listForUser(USER_ID);

        assertThat(resultado).hasSize(2);
    }

    @Test
    void naoPodeAlterarCategoriaPadraoDoSistema() {
        Category sistema = new Category(null, "Lazer", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#A855F7", "icone");
        when(categoryRepository.findById(10L)).thenReturn(Optional.of(sistema));

        CategoryRequest request = new CategoryRequest("Lazer 2", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#A855F7", "icone");

        assertThatThrownBy(() -> categoryService.update(USER_ID, 10L, request))
                .isInstanceOf(AccessDeniedApiException.class);
    }

    @Test
    void naoPodeAlterarCategoriaDeOutroUsuario() {
        Category deOutroUsuario = new Category(OTHER_USER_ID, "Viagens", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#A855F7", "icone");
        when(categoryRepository.findById(20L)).thenReturn(Optional.of(deOutroUsuario));

        CategoryRequest request = new CategoryRequest("Viagens 2", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#A855F7", "icone");

        assertThatThrownBy(() -> categoryService.update(USER_ID, 20L, request))
                .isInstanceOf(AccessDeniedApiException.class);
    }

    @Test
    void podeAlterarCategoriaPropria() {
        Category propria = new Category(USER_ID, "Hobby", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#A855F7", "icone");
        when(categoryRepository.findById(30L)).thenReturn(Optional.of(propria));

        CategoryRequest request = new CategoryRequest("Hobby Novo", CategoryTipo.VARIAVEL, Grupo503020.DESEJO, "#111111", "icone2");
        CategoryResponse resultado = categoryService.update(USER_ID, 30L, request);

        assertThat(resultado.nome()).isEqualTo("Hobby Novo");
        assertThat(resultado.cor()).isEqualTo("#111111");
    }

    @Test
    void categoriaInexistenteLancaResourceNotFound() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.delete(USER_ID, 99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
