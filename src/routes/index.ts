import { Router } from "express";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.ts";
import { protect } from "middlewares/auth.middleware.ts";
import orderRoutes from "./order.routes.ts";
import categoryRoutes from "./category.routes.ts";

const router = Router();

// --- 1. PUBLIC ROUTES ---
// This is open. No token required.
router.use("/auth", authRoutes);

// --- 2. THE GUARD ---
// Every request that reaches this point MUST pass the protect middleware.
// If it fails, the guard sends a 401 error and the code below never runs.
router.use(protect);

// --- 3. PROTECTED ROUTES ---
// These are now secure by default.
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);

export default router;
