package edu.uok.stu.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF to allow POST requests from your frontend
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configure authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Permit all requests to your messages API
                        .requestMatchers("/api/messages/**").permitAll()
                        // Any other request must be authenticated (standard safety)
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
