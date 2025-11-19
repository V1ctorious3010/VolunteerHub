package com.example.backend.config;

import com.example.backend.security.JwtAuthenticationFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    // Tạo nguồn cấu hình CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Sử dụng AllowedOriginPatterns cho tương thích tốt nhất với allowCredentials(true)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",
            "https://volunteer-management-sys-66dad.web.app"
        ));

        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Áp dụng CORS cấu hình ở trên
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Vô hiệu hóa CSRF cho Stateless API
            .csrf(AbstractHttpConfigurer::disable)

            // Vô hiệu hóa Form Login và Basic Auth
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)

            // Thiết lập Session là STATELESS
            .sessionManagement(
                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .logout(AbstractHttpConfigurer::disable)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // Cấu hình ủy quyền
            .authorizeHttpRequests(auth -> auth
                // Cho phép OPTIONS (CORS pre-flight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Cho phép các API công khai truy cập không cần xác thực
                .requestMatchers(
                    "/",
                    "/auth/register",
                    "/auth/login",
                    "/auth/refresh"
                ).permitAll()

                // Mọi request khác đều phải được xác thực
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}