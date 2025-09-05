# AESAP - Branded Website Clone

## Overview

AESAP is a full-stack web application for managing and showcasing products, inspired by the Aesop website. It consists of a backend RESTful API and a modern frontend client. The platform supports public product browsing and a CMS dashboard for admins and staff to manage content and inventory.

## Features

### Frontend (client):

- Responsive public portal for browsing products and categories
- Product detail view
- User authentication (login)
- CMS dashboard for admins/staff:
  - Manage products (add, edit, delete, update image)
  - Manage categories
  - Add staff users
- Modern UI built with React and Vite

### Backend (server):

- RESTful API for products, categories, and users
- JWT-based authentication and role-based authorization (Admin, Staff)
- CRUD operations for products and categories
- Image upload for products (Cloudinary integration)
- Public endpoints for viewing products and categories
- Error handling middleware
- Comprehensive test coverage (Jest)

## Tech Stack

- **Frontend:** ReactJS, Vite, Axios, React Router, SweetAlert2, CSS
- **Backend:** Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT, Cloudinary, Multer, Jest

## Project Structure

- `server/` — Backend REST API (Express, Sequelize, PostgreSQL)
- `client/` — Frontend client (React, Vite)

## API Endpoints (Backend)

### Auth

- `POST /login` — User login
- `POST /add-user` — Add new user (Admin only)

### Products

- `GET /products` — List products (auth required)
- `POST /products` — Create product (auth required)
- `GET /products/:id` — Get product by ID (auth required)
- `PUT /products/:id` — Update product (Admin/Staff)
- `DELETE /products/:id` — Delete product (Admin/Staff)
- `PATCH /products/:id/image-url` — Update product image (Admin/Staff, Cloudinary)

### Categories

- `GET /categories` — List categories
- `POST /categories` — Create category
- `PUT /categories/:id` — Update category

### Public

- `GET /pub/products` — List products (public)
- `GET /pub/categories` — List categories (public)
- `GET /pub/products/:id` — Get product by ID (public)

## Getting Started

### Backend

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup PostgreSQL and update `config/config.json`
4. Run migrations and seeders: `npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
5. Start server: `npm run dev`

### Frontend

1. Navigate to client folder
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Environment Variables

- **Backend:** Create a `.env` file for sensitive configs (e.g., JWT secret, Cloudinary keys)
- **Frontend:** Configure API base URL in `src/lib/http.js` if needed

## Testing

- **Backend:** Run tests with `npm test`

## License & Disclaimer

This project is intended solely for educational purposes as part of a bootcamp assignment. It is **not** intended to copy or infringe upon the original Aesop website and is not affiliated with or endorsed by Aesop.
