package com.gastosapp.service;

import com.gastosapp.domain.entity.User;
import com.gastosapp.domain.enums.Role;
import com.gastosapp.dto.auth.AuthResponse;
import com.gastosapp.dto.auth.LoginRequest;
import com.gastosapp.dto.auth.RegisterRequest;
import com.gastosapp.dto.auth.UserResponse;
import com.gastosapp.exception.ConflictException;
import com.gastosapp.repository.UserRepository;
import com.gastosapp.security.AuthenticatedUser;
import com.gastosapp.security.CustomUserDetailsService;
import com.gastosapp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("EMAIL_ALREADY_REGISTERED", "Este e-mail já está cadastrado");
        }

        User user = new User(request.nome(), request.email(), passwordEncoder.encode(request.senha()), Role.USER);
        user = userRepository.save(user);

        AuthenticatedUser authenticatedUser = CustomUserDetailsService.toAuthenticatedUser(user);
        String token = jwtTokenProvider.generateToken(authenticatedUser);

        return new AuthResponse(token, toUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuário autenticado não encontrado"));

        AuthenticatedUser authenticatedUser = CustomUserDetailsService.toAuthenticatedUser(user);
        String token = jwtTokenProvider.generateToken(authenticatedUser);

        return new AuthResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getNome(), user.getEmail(), user.getRole());
    }
}
