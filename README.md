# Alofa Haircare

## Project Overview

This project is an eCommerce platform designed for Alofa Haircare to provide a seamless shopping experience for users. The site allows users to browse products, manage their carts, and complete transactions with secure payment options. This also allows admin to manage products and view sales reports.

## Features

- User registration and authentication
- Product browsing and search functionality
- Shopping cart and checkout process
- Payment gateway integration
- Order management and tracking
- Inventory management system
- Sales report

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript, React.js, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL
- **Version Control:** Git, GitHub

## Team Members

- Cassey Anne Gempesaw
- Arabella Grace Mejorada
- John Robert Anthony Tabudlong

---

## Installation Guide

### **1. Clone the Repository**
```sh
git clone https://github.com/catgempesaw/alofa-haircare.git
cd alofa-haircare
```

---

### **2. Install and Run the Admin Dashboard (Client)**
```sh
cd client
npm install  # Install dependencies
npm start    # Start React app
```
- Runs on: `http://localhost:3000`

---

### **3. Install and Run the E-Commerce Web (E-commerce)**
```sh
cd ../ecommerce-web
npm install  # Install dependencies
npm run dev  # Start development server
```
- Runs on: `http://localhost:5173`

---

### **4. Install and Run the Backend (Server)**
```sh
cd ../server
npm install  # Install dependencies
npm start    # Start backend server
```
- Runs on: `http://localhost:5000` (or as configured in `.env`)

---

## Running the Full Application
To start the full project, open **three terminals** and run each section in parallel:

```sh
# Terminal 1 (Client)
cd client
npm start

# Terminal 2 (E-Commerce Web)
cd ecommerce-web
npm run dev

# Terminal 3 (Backend)
cd server
npm start
```
