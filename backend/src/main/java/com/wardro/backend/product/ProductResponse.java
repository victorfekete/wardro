package com.wardro.backend.product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String brand,
        String color,
        String size,
        Integer stock,
        String imageUrl,
        Long categoryId,
        String categoryName
) {
}