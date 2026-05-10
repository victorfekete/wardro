package com.wardro.backend.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotEmpty List<@Valid OrderItemRequest> items
) {
}