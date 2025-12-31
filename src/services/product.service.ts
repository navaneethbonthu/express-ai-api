import { Product } from "../models/product.js";
import { prisma } from "../lib/prisma.js";

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> {
    return prisma.product.create({
      data: product,
    });
  }
}
