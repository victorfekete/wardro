package com.wardro.backend.product;

import com.wardro.backend.category.Category;
import com.wardro.backend.category.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(
            ProductRepository productRepository,
            CategoryService categoryService
    ) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public ProductPageResponse getAllProducts(
            String search,
            Long categoryId,
            String color,
            String size,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int pageSize,
            String sortBy,
            String sortDirection
    ) {
        Specification<Product> spec = ProductSpecification.isActive();

        spec = spec.and(ProductSpecification.hasSearch(search));
        spec = spec.and(ProductSpecification.hasCategory(categoryId));
        spec = spec.and(ProductSpecification.hasColor(color));
        spec = spec.and(ProductSpecification.hasSize(size));
        spec = spec.and(ProductSpecification.priceGreaterThanOrEqual(minPrice));
        spec = spec.and(ProductSpecification.priceLessThanOrEqual(maxPrice));

        Sort sort = createSort(sortBy, sortDirection);

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<ProductResponse> content = productPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new ProductPageResponse(
                content,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Sort createSort(String sortBy, String sortDirection) {
        String safeSortBy = switch (sortBy) {
            case "name", "price", "brand", "color", "size", "stock" -> sortBy;
            default -> "id";
        };

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return Sort.by(direction, safeSortBy);
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductById(id);
        return mapToResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryService.findCategoryById(request.categoryId());

        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .brand(request.brand())
                .color(request.color())
                .size(request.size())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .active(true)
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);

        return mapToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);
        Category category = categoryService.findCategoryById(request.categoryId());

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setBrand(request.brand());
        product.setColor(request.color());
        product.setSize(request.size());
        product.setStock(request.stock());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return mapToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        product.setActive(false);
        productRepository.save(product);
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
                product.getImageUrl(),
                product.getActive(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }
}