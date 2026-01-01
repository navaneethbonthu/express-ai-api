import { Router } from "express";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.ts";

const router = Router();

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/api/auth", authRoutes);

export default router;
