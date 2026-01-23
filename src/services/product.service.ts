import { Product } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";

export class ProductService {
  async getAllProducts(query: any, userId: string) {
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
        { userId }, // Restrict to user's products
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
          category: {
            select: { name: true }, // Include category details
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

  async getProductById(id: string, userId: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.userId !== userId) {
      throw new AppError(
        "You do not have permission to view this product",
        403,
      );
    }

    return product;
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "userId">,
    userId: string,
  ): Promise<Product> {
    const { categoryId, ...rest } = productData;
    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    return prisma.product.create({
      data: { ...rest, userId, categoryId },
    });
  }

  async updateProduct(
    id: string,
    productData: Partial<
      Omit<Product, "id" | "createdAt" | "updatedAt" | "userId">
    >,
    userId: string,
  ): Promise<Product | null> {
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }
    if (existingProduct.userId !== userId) {
      throw new AppError(
        "You do not have permission to update this product",
        403,
      );
    }

    if (productData.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: productData.categoryId },
      });
      if (!categoryExists) {
        throw new Error("Category not found");
      }
    }

    return prisma.product.update({
      where: { id },
      data: productData,
    });
  }

  async deleteProduct(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    if (existing.userId !== userId) {
      throw new AppError(
        "You do not have permission to delete this product",
        403,
      );
    }

    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new AppError("Failed to delete product", 500);
    }
  }
}
