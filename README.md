# MonoCart - E-Commerce Backend

A complete, production-level monolithic backend for an e-commerce application, built with Node.js, TypeScript, Express, and Drizzle ORM.

## ✨ Features

* **Authentication:** Secure user registration and login using JWTs.
* **Role-Based Access:** `admin` and `customer` roles with protected routes.
* **User Verification:** Email and (mock) SMS OTP verification flows.
* **Product Management:** Admin-only endpoints for creating, updating, and deleting products.
* **Image Uploads:** Handles file uploads to a cloud service (Cloudinary).
* **Advanced Product Catalog:** Public endpoint to list products with filtering, sorting, and pagination.
* **Full Cart Functionality:** Add, view, update, and remove items from a persistent shopping cart.
* **Transactional Orders:** A robust checkout process that converts a cart into a permanent order within a database transaction.
* **Inventory Management:** Automatically decrements stock on successful purchase.
* **Real-Time Updates:** Broadcasts live inventory updates using WebSockets after a checkout.
* **Automated Testing & CI/CD:** Includes integration tests with Jest/Supertest and an automated deployment pipeline with GitHub Actions.

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Drizzle ORM
* **Authentication:** JWT (jsonwebtoken), bcrypt.js
* **File Uploads:** Multer, Cloudinary
* **Validation:** Zod
* **Testing:** Jest, Supertest
* **Deployment:** Render, GitHub Actions

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm
* A PostgreSQL database (e.g., from [Neon](https://neon.tech))
* A Cloudinary account
* A Mailtrap account (for development)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/monocart-backend.git](https://github.com/your-username/monocart-backend.git)
    cd monocart-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```
    DATABASE_URL="your_neon_database_url"
    JWT_SECRET="your_strong_jwt_secret"
    
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

    MAILTRAP_HOST="sandbox.smtp.mailtrap.io"
    MAILTRAP_PORT="2525"
    MAILTRAP_USER="your_mailtrap_user"
    MAILTRAP_PASS="your_mailtrap_password"
    ```

4.  **Run database migrations:**
    This will create all the necessary tables in your database.
    ```bash
    npm run db:push
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:3000`.

### Running Tests

To run the automated tests, use:
```bash
npm test
