package com.wardro.backend.product;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductById(id);
        return mapToResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .brand(request.brand())
                .color(request.color())
                .size(request.size())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setBrand(request.brand());
        product.setColor(request.color());
        product.setSize(request.size());
        product.setStock(request.stock());
        product.setImageUrl(request.imageUrl());

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getBrand(),
                product.getColor(),
                product.getSize(),
                product.getStock(),
                product.getImageUrl()
        );
    }
}