# Express AI API - Copilot Instructions

## Architecture Overview

This is a TypeScript Express.js API following a modular MVC-like pattern:

- **Routes** (`src/routes/`): Define API endpoints and delegate to controllers
- **Controllers** (`src/controllers/`): Handle HTTP requests/responses, validate input, call services
- **Services** (`src/services/`): Contain business logic, data operations (currently in-memory)
- **Models** (`src/models/`): TypeScript interfaces defining data structures

Data flows: Route → Controller → Service → (Model for types)

## Key Patterns

- **ES Modules**: Use `import/export` with `.js` extensions in import paths (TypeScript transpiles to `.js`)
- **Path Mappings**: Use `@controllers/*`, `@models/*`, `@services/*` for clean imports (configured in `tsconfig.json`)
- **Controller Methods**: Async methods returning `Promise<void>`, use `res.json()` for responses, `res.status()` for errors
- **Service Classes**: Instantiate services in controllers, methods return typed data (e.g., `Promise<Product[]>`)
- **Route Binding**: Use `.bind(controllerInstance)` when registering route handlers
- **Authentication**: JWT-based login in `UserController`, but no middleware yet - implement auth guards for protected routes

## Development Workflow

- **Run Dev Server**: `npm run dev` (uses ts-node/esm for direct TypeScript execution)
- **Build & Run**: `npm run build` (compiles to `dist/`), then `npm start`
- **No Tests**: Test script placeholder exists but not implemented

## Current State & Conventions

- **Data Storage**: In-memory arrays in services (not persistent, no database integration despite Prisma dependency)
- **Validation**: Zod imported but not used - plan for input validation in controllers/services
- **Security**: JWT secret hardcoded (use env vars), bcrypt for password hashing
- **Error Handling**: Basic status codes and messages, no centralized error middleware
- **Dependencies**: Express 5.x, Prisma (unused), JWT, bcrypt, cors, helmet

## Examples

- **Adding New Entity**: Create interface in `models/`, service class in `services/`, controller in `controllers/`, routes in `routes/`, update `routes/index.ts`
- **Protected Route**: Add JWT verification middleware (see `UserController.login` for token generation)
- **Database Integration**: Replace in-memory arrays with Prisma client calls (schema not defined yet)

Focus on extending the service layer for business logic, keeping controllers thin for request/response handling.
