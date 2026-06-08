package com.wardro.backend.auth;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        Role role
) {
}