# User-Order Management System

This is a simple Node.js and Express-based REST API for managing users and their orders. It supports user registration, login, order creation, viewing, and management. The API also comes with Swagger documentation.

## Features

- ✅ User Registration and Login
- ✅ Admin and User Roles
- ✅ Order Creation, Viewing, Canceling, and Deletion
- ✅ Email Notifications for Welcome and Order Confirmation
- ✅ MongoDB Integration with Mongoose
- ✅ Auto-incrementing Order and User IDs
- ✅ Swagger API Documentation

## Technologies Used

- Node.js
- Express.js
- MongoDB + Mongoose
- Nodemailer
- Swagger (OpenAPI)
- Dotenv
- Bcrypt

## Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/BushraSiddiqueDogar/user-order-complete-swagger.git]
cd user-order-complete-swagger
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root and add the following:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user-order-db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourapp.com
BCRYPT_SALT_ROUNDS=12
```

### 4. Run the Server

```bash
npm start
```

### 5. Access Swagger Docs

Go to:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)


## API Endpoints

* `POST /api/auth/register` – Register a new user
* `POST /api/auth/login` – Login with email & password
* `GET /api/auth/me` – Get current logged-in user
* `POST /api/orders` – Create a new order
* `GET /api/orders` – Get all orders
* `GET /api/orders/:id` – Get order by ID
* `PUT /api/orders/:id/cancel` – Cancel an order
* `DELETE /api/orders/:id` – Delete an order



## License

This project is open-source and free to use.


