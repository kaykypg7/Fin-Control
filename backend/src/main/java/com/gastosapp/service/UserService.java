package com.gastosapp.service;

import com.gastosapp.domain.entity.User;
import com.gastosapp.dto.auth.UpdateProfileRequest;
import com.gastosapp.dto.auth.UserResponse;
import com.gastosapp.exception.ConflictException;
import com.gastosapp.exception.ResourceNotFoundException;
import com.gastosapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getProfile(Long userId) {
        return toResponse(findUser(userId));
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUser(userId);

        if (!user.getEmail().equalsIgnoreCase(request.email())
                && userRepository.existsByEmail(request.email())) {
            throw new ConflictException("EMAIL_ALREADY_REGISTERED", "Este e-mail já está cadastrado");
        }

        user.setNome(request.nome());
        user.setEmail(request.email());
        return toResponse(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getNome(), user.getEmail(), user.getRole());
    }
}
