import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";

export class OrderService {
  async createOrder(userId: string, productId: string, quantity: number) {
    // 1. Find the product to get the current price
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new AppError("Product not found", 404);

    // 2. Create the order
    return await prisma.order.create({
      data: {
        userId, // The Buyer
        productId, // The Item
        quantity,
        totalPrice: product.price * quantity,
        status: "pending",
      },
      // Include product info in the response so the buyer sees what they bought
      include: { product: true },
    });
  }

  async getMyOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
