import { protect, restrictTo } from "middlewares/auth.middleware.ts";
import { ProductController } from "../controllers/product.controller.js";
import { Router } from "express";
import { upload } from "middlewares/upload.middleware.ts";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAllProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));

// Only Admins can Create, Update, or Delete
router.use(protect); // Must be logged in
router.use(restrictTo("ADMIN")); // Must be an Admin
router.post(
  "/",
  upload.single("image"),
  productController.createProduct.bind(productController),
);
router.put("/:id", productController.updateProduct.bind(productController));
router.delete("/:id", productController.deleteProduct.bind(productController));

export default router;
