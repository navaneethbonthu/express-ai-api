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

  async updateProduct(
    id: string,
    product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ): Promise<Product | null> {
    try {
      return await prisma.product.update({
        where: { id },
        data: product,
      });
    } catch (error) {
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
