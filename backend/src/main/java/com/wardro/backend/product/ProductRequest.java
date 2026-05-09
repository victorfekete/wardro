package com.wardro.backend.product;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotBlank String brand,
        @NotBlank String color,
        @NotBlank String size,
        @NotNull @Min(0) Integer stock,
        String imageUrl
) {
}