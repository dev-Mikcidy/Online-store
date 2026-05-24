# 🛒 Electronics Online Store

A fullstack MERN project that simulates a modern e-commerce platform for electronics products.

Users can browse products by category, view detailed product pages, create accounts, manage a shopping cart and complete secure payments using Stripe. The application also includes account management and order functionality.

The project features a protected admin dashboard where administrators can manage products and inventory, view order statistics and monitor sales analytics through charts and visualizations.

## Features

- User authentication with JWT
- Product browsing and filtering
- Shopping cart functionality
- Stripe payment integration
- Admin dashboard
- Product CRUD operations
- Sales analytics charts
- Responsive design

## Architecture

- Frontend built with React + Vite
- REST API built with Express
- MongoDB database with Mongoose
- JWT authentication
- Stripe payment integration

## Live Demo

Frontend (Vercel): online-store-six-inky.vercel.app 

Backend API (Render): https://online-store-8qo5.onrender.comapi/products

# Project Setup Instructions

This section explains how to clone the project, install the needed dependencies and run the frontend and backend locally.

---

## 1. Clone the repository

```bash
git clone https://github.com/aklimson/Online-store.git
```

Then open the project folder:

```bash
cd online-store
```
---

## 2. Install dependencies

The `node_modules` folders are not uploaded to GitHub. This is normal.

After cloning the project, install the dependencies by running:

```bash
npm install
npm run install-all
```

This installs:

- Root dependencies
- Frontend dependencies
- Backend dependencies

---

## 3. Run the full project

From the root `online-store` folder, run:

```bash
npm run dev
```

This starts both:

- React frontend
- Express backend

---

## 4. Run frontend only

```bash
cd frontend
npm install
npm run dev
```
---

## 5. Run backend only

```bash
cd backend
npm install
npm run dev
```
---

## 6. Environment variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
API_URL= http://localhost
JWT_SECRET=your_jwt_secret_here
STRIPE_API_KEY=your_stripe_key
ENDPOINT_SECRET_KEY=your_stripe_webhook_secret
```

Do not upload `.env` to GitHub.

---

## 7. Seed the database

This project includes a seed script to populate the database with initial products.

### Run the seed script

From the `backend` folder:

```bash
node productSeed.js

```
