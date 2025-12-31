# Express AI API

A TypeScript Express.js API with Prisma and PostgreSQL integration.

## Features

- User authentication with JWT
- Product management
- Modular MVC architecture
- TypeScript support
- Prisma ORM with SQLite (development) / PostgreSQL (production)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will run at http://localhost:3000

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product

### Users

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Health Check

- `GET /health` - Health check endpoint

## Database

The application uses SQLite for development and can be configured for PostgreSQL in production.

To switch to PostgreSQL:

1. Update `prisma/schema.prisma` datasource to `postgresql`
2. Set the `DATABASE_URL` environment variable
3. Run `npx prisma migrate dev`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)
