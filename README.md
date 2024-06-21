NestJS Order Management System
This project implements an order management system using NestJS and PostgreSQL.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js and npm (Node Package Manager)
PostgreSQL database server
Getting Started
Clone the repository:

bash
Copy code
git clone <repository_url>
cd order-management-system
Install dependencies:

bash
Copy code
npm install
Set up the PostgreSQL database:

Create a PostgreSQL database.
Update the database connection string in src/prisma/prisma.schema to point to your database.
Run database migrations:

bash
Copy code
npx prisma migrate dev
This will apply any pending migrations to your database.

Seed the database (optional):

If you have seed data defined (src/prisma/seed.ts), you can seed the database:

bash
Copy code
npx ts-node src/prisma/seed.ts
Start the application:

bash
Copy code
npm run start:dev
This command starts the NestJS application in development mode. The application will listen for requests at http://localhost:3000.

Testing
To test the APIs, you can use tools like Postman or cURL. Here are the available endpoints:

Create Order: POST /api/orders

Create a new order for a user with products in their cart.
Get Order by ID: GET /api/orders/:userId/:orderId

Retrieve the details of an order by user ID and order ID.
Update Order Status: PUT /api/orders/:orderId/status

Update the status of an order.
Add to Cart: POST /api/cart/add

Add a product to the user's cart.
Get User Cart: GET /api/cart/:userId

Retrieve the user's cart.
Update Cart: PUT /api/cart/update

Update the quantity of a product in the user's cart.
Remove from Cart: DELETE /api/cart/remove

Remove a product from the user's cart.
Additional Notes
Ensure PostgreSQL is running and accessible.
Customize the environment variables and configuration as per your setup in src/config.
Refer to the NestJS documentation for more details on project structure and customization.
