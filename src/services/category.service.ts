import { prisma } from "../lib/prisma.js";

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }, // Shows how many products are in this category
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          select: { id: true, name: true, price: true }, // Pick which product info to show
        },
      },
    });
  }

  getCategoryIdByname(name: string) {
    return prisma.category.findUnique({
      where: { name },
      select: { id: true },
    });
  }
  async createCategory(name: string) {
    return await prisma.category.create({
      data: { name },
    });
  }

  async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
