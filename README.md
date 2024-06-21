## NestJS Order Management System

This repository houses an Order Management System built using NestJS and PostgreSQL.

### Prerequisites

Before getting started, ensure you have the following installed:

- Node.js and npm (Node Package Manager)
- PostgreSQL database server

### Getting Started

Clone the repository:

```bash
git clone https://github.com/AhmeddHanyy/Order-Management-System.git
cd order-management-system
```

Install dependencies:

```bash
npm install
```

Set up the PostgreSQL database:

1. Create a PostgreSQL database.
2. Update the database connection string in `src/prisma/prisma.schema` to point to your database.
   
Run database migrations:

```bash
npx prisma migrate dev
```

This will apply any pending migrations to your database.

(Optional) Seed the database:

If you have seed data defined (`src/prisma/seed.ts`), you can seed the database:

```bash
npx ts-node src/prisma/seed.ts
```

### Starting the Application

To start the application in development mode:

```bash
npm run start:dev
```

The application will listen for requests at http://localhost:3000.

### Testing

To test the APIs, you can use tools like Postman or cURL. Here are the available endpoints:

- **Create Order:** POST `/api/orders`
  - Create a new order for a user with products in their cart.
  
- **Get Order by ID:** GET `/api/orders/:userId/:orderId`
  - Retrieve the details of an order by user ID and order ID.
  
- **Update Order Status:** PUT `/api/orders/:orderId/status`
  - Update the status of an order.
  
- **Add to Cart:** POST `/api/cart/add`
  - Add a product to the user's cart.
  
- **Get User Cart:** GET `/api/cart/:userId`
  - Retrieve the user's cart.
  
- **Update Cart:** PUT `/api/cart/update`
  - Update the quantity of a product in the user's cart.
  
- **Remove from Cart:** DELETE `/api/cart/remove`
  - Remove a product from the user's cart.

### Additional Notes

- Ensure PostgreSQL is running and accessible.
- Customize the environment variables and configuration in `src/config` as per your setup.
- Refer to the NestJS documentation for more details on project structure and customization options.
