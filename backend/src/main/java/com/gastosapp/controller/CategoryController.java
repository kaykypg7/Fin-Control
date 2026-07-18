package com.gastosapp.controller;

import com.gastosapp.dto.category.CategoryRequest;
import com.gastosapp.dto.category.CategoryResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> list(@CurrentUser AuthenticatedUser user) {
        return categoryService.listForUser(user.getUserId());
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @CurrentUser AuthenticatedUser user, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(user.getUserId(), request));
    }

    @PutMapping("/{id}")
    public CategoryResponse update(
            @CurrentUser AuthenticatedUser user, @PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(user.getUserId(), id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@CurrentUser AuthenticatedUser user, @PathVariable Long id) {
        categoryService.delete(user.getUserId(), id);
        return ResponseEntity.noContent().build();
    }
}
