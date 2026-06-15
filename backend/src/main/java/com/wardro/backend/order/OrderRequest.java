package com.wardro.backend.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(
        @NotBlank(message = "Full name is required")
        String deliveryFullName,

        @NotBlank(message = "Phone is required")
        String deliveryPhone,

        @NotBlank(message = "Address is required")
        String deliveryAddress,

        @NotBlank(message = "City is required")
        String deliveryCity,

        @NotBlank(message = "Postal code is required")
        String deliveryPostalCode,

        String deliveryNotes,

        @NotEmpty(message = "Order must contain at least one item")
        List<@Valid OrderItemRequest> items
) {}