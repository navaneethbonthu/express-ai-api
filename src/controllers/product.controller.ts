import { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await productService.getAllProducts();
    res.json(products);
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Product id is required" });
      return;
    }
    const product = await productService.getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  }
}
