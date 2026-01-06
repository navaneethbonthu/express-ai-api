import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";

const router = Router();
const controller = new CategoryController();

// Public: Anyone can see categories
router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);
router.post("/", controller.createCategory);
router.delete("/:id", controller.deleteCategory);

export default router;
