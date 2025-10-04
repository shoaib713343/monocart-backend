# PRD & System Design: Monolithic E-Commerce Backend

**Version:** 4.0 (Final Blueprint)
**Date:** September 29, 2025

## 1. Introduction & Vision

This document outlines the product requirements and technical system design for a production-level e-commerce backend. The project will be built as a **modular monolith** using a modern TypeScript stack. The primary goal is to create a robust, secure, and scalable application that serves as a comprehensive portfolio piece, demonstrating industry best practices in backend development.

---

## 2. Features & Requirements

### 2.1. User & Authentication
* **Registration:** Users can create an account with an email, password, and name. Passwords must be securely hashed.
* **Login:** Registered users can log in to receive a JWT for authenticating subsequent requests.
* **Role-Based Access:** Users will have `CUSTOMER` or `ADMIN` roles, restricting access to certain endpoints.
* **Email Verification:** New users will receive a verification email (using Mailtrap for development) with a unique token to verify their email address.
* **Forgot & Reset Password:** Users can request a password reset link via email. This link will contain a secure, single-use token.
* **Mobile Verification (Development):** Users can add a phone number. To verify it, an OTP will be generated and **logged to the console** for manual entry, simulating a real SMS service.

### 2.2. Product Management (Admin)
* **Create Product:** Admins can add new products, including details like name, price, stock quantity, and category.
* **Image Uploads:** The product creation process will handle image uploads via a `multipart/form-data` endpoint, hosting files on Cloudinary.
* **Update/Delete Product:** Admins can modify or remove existing products.

### 2.3. Product Catalog (Public)
* **List Products:** The API will provide an endpoint to list all products with advanced filtering (by category, price), sorting (by price, name), and pagination.
* **View Single Product:** Users can retrieve the details of a single product.

### 2.4. E-Commerce Logic
* **Shopping Cart:** Authenticated users have a persistent cart to add, update, and remove products.
* **Order Creation:** Users can convert their cart into an order. This action must occur within a **database transaction** to ensure data integrity.
* **Order History:** Users can view a list of their past orders and the details of a specific order.
* **Admin Order Management:** Admins can view a list of all orders from all customers.
* **Payment Records:** Each order will have an associated payment record.

### 2.5. Real-Time Features
* **Live Inventory Updates:** When an order is successfully processed, the `stockQuantity` of the relevant products will be decreased. This change will be broadcast via **WebSockets** to all connected clients, allowing for a real-time UI update.

---

## 3. System Architecture

We will use a **modular monolith** architecture. The application is a single deployable unit, but the code is organized into distinct modules. This simplifies development while maintaining strong data consistency.



* **External Services:**
    * **PostgreSQL (Neon):** Primary database.
    * **Image Hosting (Cloudinary):** For product images.
    * **Email (Mailtrap):** For development email sending.
    * **Hosting (Render/Fly.io):** For application deployment.

---

## 4. Technology Stack

* **Language/Runtime:** TypeScript, Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **ORM/Query Builder:** Drizzle ORM
* **Authentication:** JSON Web Tokens (JWT), bcrypt.js
* **Real-Time:** WebSockets (using `ws` library)
* **File Uploads:** Multer
* **Validation:** Zod
* **Security:** Helmet, express-rate-limit
* **Development Tools:** Jira, Postman, Git/GitHub

---

## 5. Data Models (High-Level Schema)

* **User:** `id`, `email`, `password`, `role`, `isEmailVerified`, `emailVerificationToken`, `passwordResetToken`, `passwordResetExpires`
* **Product:** `id`, `name`, `description`, `price`, `stockQuantity`, `images` (JSON array of Cloudinary URLs), `categoryId`
* **Category:** `id`, `name`
* **Order:** `id`, `userId`, `totalAmount`, `status`
* **OrderItem:** `id`, `orderId`, `productId`, `quantity`, `price`
* **Payment:** `id`, `orderId`, `status`, `transactionId`

---

## 6. API Endpoints

| Endpoint | Method | Description | Auth |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | Register a new user. | Public |
| `/api/v1/auth/login` | `POST` | Login and get a JWT. | Public |
| `/api/v1/auth/verify-email` | `POST` | Verify email with a token. | Public |
| `/api/v1/auth/forgot-password`| `POST` | Request a password reset email. | Public |
| `/api/v1/auth/reset-password` | `POST` | Reset password with a token. | Public |
| `/api/v1/products` | `GET` | Get products (with filtering/sorting/pagination). | Public |
| `/api/v1/products` | `POST` | Create a new product. | Admin |
| `/api/v1/cart` | `GET`, `POST`| Get cart or add items. | Customer |
| `/api/v1/orders` | `POST` | Create an order from the cart. | Customer |
| `/api/v1/orders` | `GET` | Get the current user's order history. | Customer |
| `/api/v1/orders/:id` | `GET` | Get details of a specific order. | Customer |
| `/api/v1/admin/orders` | `GET` | Get a list of all orders. | Admin |
| `/api/v1/payments/razorpay/webhook` | `POST` | Mock Razorpay payment webhook. | Public |

---

## 7. Key Workflows

* **Password Reset:** The user requests a reset. The API generates a secure token, saves its hash to the `User` table with an expiry, and emails the original token to the user. The user submits the token with a new password to validate and complete the reset.
* **Product Creation:** An admin sends a `multipart/form-data` request. **Multer** uploads the image to **Cloudinary**, and the controller saves the product data (including the image URL) to the database using **Drizzle**.
* **Checkout & Inventory Update:** A user creates an order. The service initiates a **Drizzle database transaction** to create order records and decrement product stock. On success, the server broadcasts an `INVENTORY_UPDATE` message via **WebSockets**.

---

## 8. Non-Functional Requirements

* **Security:** Enforced via JWTs, password hashing, Zod validation, Helmet security headers, and rate limiting.
* **Reliability:** A global error-handling middleware will ensure consistent error responses. Database transactions will maintain data integrity.
* **Testability:** Code will be structured for unit (Jest) and integration (Supertest) testing.

---

## 9. Out of Scope

* Frontend UI / Client Application
* Multi-Vendor Marketplace Functionality
* Advanced analytics or reporting dashboards

---

## 10. Development & Deployment

* **Project Management:** Tasks will be tracked in Jira.
* **Version Control:** The project will be hosted on GitHub.
* **CI/CD:** A GitHub Actions workflow will be created to automate testing and deployment to our hosting provider (Render) upon pushes to the main branch.