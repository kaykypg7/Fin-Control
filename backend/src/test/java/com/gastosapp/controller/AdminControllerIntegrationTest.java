package com.gastosapp.controller;

import com.gastosapp.domain.entity.User;
import com.gastosapp.domain.enums.Role;
import com.gastosapp.repository.UserRepository;
import com.gastosapp.security.CustomUserDetailsService;
import com.gastosapp.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifica a fronteira de privacidade do M4: admin acessa /api/admin/** (users, metrics),
 * usuario comum recebe 403, e a resposta de /admin/users nunca carrega valores financeiros
 * individuais (apenas contagens) - so contagens agregadas, nunca saldo/meta/gasto de terceiros.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AdminControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void adminAcessaUsersEMetricsUsuarioComumRecebe403() {
        User admin = userRepository.save(new User(
                "Admin", "admin-" + System.nanoTime() + "@teste.com", passwordEncoder.encode("senha123"), Role.ADMIN));
        User usuarioComum = userRepository.save(new User(
                "User", "user-" + System.nanoTime() + "@teste.com", passwordEncoder.encode("senha123"), Role.USER));

        String adminToken = jwtTokenProvider.generateToken(CustomUserDetailsService.toAuthenticatedUser(admin));
        String userToken = jwtTokenProvider.generateToken(CustomUserDetailsService.toAuthenticatedUser(usuarioComum));

        var usersResponse = restTemplate.exchange("/api/admin/users", HttpMethod.GET, authEntity(adminToken), String.class);
        assertThat(usersResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(usersResponse.getBody())
                .doesNotContain("valorMeta")
                .doesNotContain("valorGasto")
                .doesNotContain("salario")
                .contains("totalLancamentos");

        var metricsResponse = restTemplate.exchange("/api/admin/metrics", HttpMethod.GET, authEntity(adminToken), String.class);
        assertThat(metricsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var categoriesResponse = restTemplate.exchange("/api/admin/categories", HttpMethod.GET, authEntity(adminToken), String.class);
        assertThat(categoriesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        var forbiddenResponse = restTemplate.exchange("/api/admin/users", HttpMethod.GET, authEntity(userToken), String.class);
        assertThat(forbiddenResponse.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    private HttpEntity<Void> authEntity(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return new HttpEntity<>(headers);
    }
}
