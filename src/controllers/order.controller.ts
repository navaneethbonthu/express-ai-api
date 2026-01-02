import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service.js";
import { AppError } from "../utils/app-error.js";

const orderService = new OrderService();

export class OrderController {
  async checkout(req: any, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return next(new AppError("Product ID and quantity are required", 400));
      }

      const order = await orderService.createOrder(
        req.userId,
        productId,
        quantity
      );
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: any, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getMyOrders(req.userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}
