package com.wardro.backend.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        BigDecimal totalPrice,
        OrderStatus status,
        LocalDateTime createdAt,
        Long userId,
        String customerName,
        String customerEmail,
        List<OrderItemResponse> items
) {
}