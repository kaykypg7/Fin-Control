package com.gastosapp.controller;

import com.gastosapp.dto.auth.UpdateProfileRequest;
import com.gastosapp.dto.auth.UserResponse;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CurrentUser;
import com.gastosapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public UserResponse getProfile(@CurrentUser AuthenticatedUser user) {
        return userService.getProfile(user.getUserId());
    }

    @PutMapping
    public UserResponse updateProfile(
            @CurrentUser AuthenticatedUser user, @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(user.getUserId(), request);
    }
}
