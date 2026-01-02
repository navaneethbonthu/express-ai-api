import { Product } from "../models/product.js";
import { prisma } from "../lib/prisma.js";

export class ProductService {
  async getAllProducts(userId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { userId },
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (product) {
      return product;
    }
    return null;
  }

  async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
    userId: string
  ): Promise<Product> {
    return prisma.product.create({
      data: { ...product, userId },
    });
  }

  async updateProduct(
    id: string,
    product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
    userId: string
  ): Promise<Product | null> {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return null;
    }
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
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing ) {
      return false;
    }
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
