import { protect } from "middlewares/auth.middleware.ts";
import { ProductController } from "../controllers/product.controller.js";
import { Router } from "express";
import { upload } from "middlewares/upload.middleware.ts";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAllProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post(
  "/",
  protect, // Add protect middleware
  upload.single("image"),
  productController.createProduct.bind(productController)
);
router.put(
  "/:id",
  protect,
  productController.updateProduct.bind(productController)
);
router.delete(
  "/:id",
  protect,
  productController.deleteProduct.bind(productController)
);

export default router;
