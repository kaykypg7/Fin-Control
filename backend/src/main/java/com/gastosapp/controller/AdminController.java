package com.gastosapp.controller;

import com.gastosapp.dto.admin.AdminMetricsResponse;
import com.gastosapp.dto.admin.AdminUserResponse;
import com.gastosapp.dto.category.CategoryRequest;
import com.gastosapp.dto.category.CategoryResponse;
import com.gastosapp.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<AdminUserResponse> users() {
        return adminService.listUsers();
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return adminService.listSystemCategories();
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createSystemCategory(request));
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return adminService.updateSystemCategory(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        adminService.deleteSystemCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metrics")
    public AdminMetricsResponse metrics() {
        return adminService.metrics();
    }
}
