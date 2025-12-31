import { Request, Response } from "express";
import { z } from "zod";
import { ProductService } from "../services/product.service.js";
import { Product } from "../models/product.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

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
    try {
      const validatedData = createProductSchema.parse(req.body);
      // Transform undefined to null for description
      const productData = {
        ...validatedData,
        description: validatedData.description ?? null,
      };
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: (error as z.ZodError).issues,
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Product id is required" });
      return;
    }
    try {
      const validatedData = updateProductSchema.parse(req.body);
      // Filter out undefined values
      const updateData: Partial<
        Omit<Product, "id" | "createdAt" | "updatedAt">
      > = {};
      if (validatedData.name !== undefined)
        updateData.name = validatedData.name;
      if (validatedData.price !== undefined)
        updateData.price = validatedData.price;
      if (validatedData.description !== undefined)
        updateData.description = validatedData.description;
      const updatedProduct = await productService.updateProduct(id, updateData);
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation error",
          errors: (error as z.ZodError).issues,
        });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: "Product id is required" });
      return;
    }
    const deleted = await productService.deleteProduct(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }
}
