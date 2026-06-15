package com.wardro.backend.order;

import com.wardro.backend.product.Product;
import com.wardro.backend.product.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import com.wardro.backend.auth.AppUser;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = findOrderById(id);
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest request, AppUser user) {
        Order order = Order.builder()
                .status(OrderStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .user(user)
                .deliveryFullName(request.deliveryFullName())
                .deliveryPhone(request.deliveryPhone())
                .deliveryAddress(request.deliveryAddress())
                .deliveryCity(request.deliveryCity())
                .deliveryPostalCode(request.deliveryPostalCode())
                .deliveryNotes(request.deliveryNotes())
                .build();


        List<OrderItem> orderItems = request.items()
                .stream()
                .map(itemRequest -> createOrderItem(order, itemRequest))
                .toList();

        BigDecimal totalPrice = orderItems.stream()
                .map(item -> item.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = findOrderById(id);
        order.setStatus(status);

        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }

    public List<OrderResponse> getMyOrders(AppUser user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OrderItem createOrderItem(Order order, OrderItemRequest itemRequest) {
        Product product = productRepository.findById(itemRequest.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (Boolean.FALSE.equals(product.getActive())) {
            throw new RuntimeException("Product is no longer available: " + product.getName());
        }

        if (product.getStock() <= 0) {
            throw new RuntimeException("Product is out of stock: " + product.getName());
        }

        if (product.getStock() < itemRequest.quantity()) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }

        product.setStock(product.getStock() - itemRequest.quantity());
        productRepository.save(product);

        return OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemRequest.quantity())
                .priceAtPurchase(product.getPrice())
                .build();
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(this::mapItemToResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getFullName() : null,
                order.getUser() != null ? order.getUser().getEmail() : null,
                order.getDeliveryFullName(),
                order.getDeliveryPhone(),
                order.getDeliveryAddress(),
                order.getDeliveryCity(),
                order.getDeliveryPostalCode(),
                order.getDeliveryNotes(),
                items
        );
    }

    public OrderResponse getOrderByIdForUser(Long id, AppUser user) {
        Order order = findOrderById(id);

        boolean isAdmin = user.getRole().name().equals("ADMIN");

        if (!isAdmin) {
            if (order.getUser() == null || !order.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("You are not allowed to view this order");
            }
        }

        return mapToResponse(order);
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        BigDecimal subtotal = item.getPriceAtPurchase()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getPriceAtPurchase(),
                subtotal
        );
    }
}