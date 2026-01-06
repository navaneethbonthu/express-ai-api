import { Product } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

export class ProductService {
  async getAllProducts(query: any) {
    // 1. Extract Query Parameters with default values
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search as string;
    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;
    const categoryId = query.categoryId as string;

    // 2. Build the "Where" clause (Filtering Logic)
    const whereCondition: any = {
      AND: [
        // Search by name or description (Case-insensitive)
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
        // Price Filtering
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
      ],
    };

    // 3. Execute Database Calls (Parallel for Speed)
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Newest products first
        include: {
          user: {
            select: { name: true, email: true }, // See who owns the product
          },
        },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    // 4. Return Structured Data with Pagination Metadata
    return {
      data: products,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        itemsPerPage: limit,
      },
    };
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
    product: Omit<
      Product,
      "id" | "createdAt" | "updatedAt" | "userId" | "categoryId"
    > & { categoryId: string },
    userId: string
  ): Promise<Product> {
    return prisma.product.create({
      data: { ...product, userId },
    });
  }

  async updateProduct(
    id: string,
    product: Partial<
      Omit<Product, "id" | "createdAt" | "updatedAt" | "userId" | "categoryId">
    > & { categoryId?: string },
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
    if (!existing) {
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
