# Wardro

Wardro is a full-stack fashion e-commerce and outfit builder platform.

## Tech Stack

- Java 21
- Spring Boot 3
- PostgreSQL
- Docker
- Maven

## Current Features

- Spring Boot backend setup
- PostgreSQL database with Docker
- Health check endpoint
- Product CRUD
- Product DTOs for request and response

## API Endpoints

### Health

GET /api/health

### Products

GET /api/products  
GET /api/products/{id}  
POST /api/products  
PUT /api/products/{id}  
DELETE /api/products/{id}

## Run locally

Start PostgreSQL:

```bash
docker compose up -d