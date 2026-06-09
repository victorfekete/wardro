package com.wardro.backend.order;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.wardro.backend.auth.AppUser;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();

        return orderService.getMyOrders(user);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PostMapping
    public OrderResponse createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        AppUser user = (AppUser) authentication.getPrincipal();

        return orderService.createOrder(request, user);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return orderService.updateOrderStatus(id, status);
    }
}