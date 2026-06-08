package com.wardro.backend.config;

import com.wardro.backend.auth.AppUser;
import com.wardro.backend.auth.AppUserRepository;
import com.wardro.backend.auth.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    public CommandLineRunner createAdminUser(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String adminEmail = "admin@wardro.com";

            if (appUserRepository.existsByEmail(adminEmail)) {
                return;
            }

            AppUser admin = AppUser.builder()
                    .fullName("Wardro Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();

            appUserRepository.save(admin);
        };
    }
}