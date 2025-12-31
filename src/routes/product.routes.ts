import { ProductController } from "../controllers/product.controller.js";
import { Router } from "express";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAllProducts.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));
router.post("/", productController.createProduct.bind(productController));

export default router;
