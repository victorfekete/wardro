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
**Deployment:** Docker, Kubernetes, Traefik
**Tools:** Postman, Git, GitHub

## Kubernetes

The application is containerized with Docker and deployed to a Kubernetes cluster.

The Kubernetes setup includes:

* Backend, frontend and PostgreSQL Deployments
* Kubernetes Services for communication between the application components
* ConfigMaps for application configuration
* Secrets for database credentials and JWT configuration
* Traefik Ingress for external access
* Spring Boot Actuator health endpoints
* Liveness and readiness probes for the backend

The main routing is:

```text
/       -> frontend
/api    -> backend
```

The backend connects to PostgreSQL through the Kubernetes service:

```text
postgres-service:5432
```

## Project Structure

```text
wardro/
├── backend/
├── frontend/
└── k8s/
    ├── backend/
    ├── frontend/
    ├── postgres/
    └── ingress.yaml
```

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

The application is functional and has been containerized and deployed to Kubernetes. The current Kubernetes setup includes application configuration, secrets, service discovery, external routing and backend health monitoring.
