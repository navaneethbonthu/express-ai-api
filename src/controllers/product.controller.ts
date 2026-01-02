import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service.js";
import { AppError } from "../utils/app-error.js"; // Import your custom error class
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";
import { Product } from "@prisma/client/wasm";

const productService = new ProductService();

export class ProductController {
  // 1. Get All Products
  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await productService.getAllProducts((req as any).userId);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  // 2. Get Product By ID
  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        return next(new AppError("Product ID is required", 400));
      }

      const product = await productService.getProductById(id);

      if (!product) {
        return next(new AppError("Product not found", 404));
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // 3. Create Product
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // .parse() throws a ZodError if validation fails.
      // The catch block will send it to globalErrorHandler via next(error)
      const validatedData = createProductSchema.parse(req.body);

      const productData = {
        ...validatedData,
        description: validatedData.description ?? null,
      };

      const newProduct = await productService.createProduct(
        productData,
        (req as any).userId
      );
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  // 4. Update Product
  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        return next(new AppError("Product ID is required", 400));
      }

      const validatedData = updateProductSchema.parse(req.body);

      // Filter out undefined values to match service type expectations
      const updateData = Object.fromEntries(
        Object.entries(validatedData).filter(([, value]) => value !== undefined)
      );

      const updatedProduct = await productService.updateProduct(
        id,
        updateData as Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
        (req as any).userId
      );

      if (!updatedProduct) {
        return next(new AppError("Product not found", 404));
      }

      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  // 5. Delete Product
  async deleteProduct(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);

      if (!product) return next(new AppError("Product not found", 404));

      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
