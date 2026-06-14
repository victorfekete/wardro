# Wardro

Wardro is a full-stack fashion e-commerce application built as a portfolio project. The project includes a Spring Boot backend, a React + TypeScript frontend, PostgreSQL database integration, JWT authentication and role-based access control.

The application allows users to browse products, filter items, add products to cart, place orders and view their order history. Admin users can manage products and update order statuses.

## Features

* Product listing, details, search and filtering
* Shopping cart with quantity updates
* Checkout flow for authenticated users
* User registration and login
* JWT authentication
* Role-based access control for USER and ADMIN
* User order history
* Admin product management
* Admin order management

## Tech Stack

**Backend:** Java, Spring Boot, Spring Security, JWT, Spring Data JPA, PostgreSQL, Maven
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
**Tools:** Docker, Docker Compose, Postman, Git, GitHub

## Demo Admin Account

```text
Email: admin@wardro.com
Password: admin123
```

## How to Run Locally

Start the PostgreSQL database:

```bash
docker compose up -d
```

Run the backend:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

## Project Status

This project is still a work in progress. Current features include product management, authentication, cart, checkout, order history and admin pages. Planned improvements include better UI polish, frontend pagination, product image upload, checkout details and deployment configuration.
