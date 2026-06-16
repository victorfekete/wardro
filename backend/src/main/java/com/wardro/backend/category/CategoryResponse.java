package com.wardro.backend.category;

public record CategoryResponse(
        Long id,
        String name,
        String description,
        Boolean active
) {}