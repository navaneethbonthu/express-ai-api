import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();
const orderController = new OrderController();

router.post("/checkout", orderController.checkout);
router.get("/my-orders", orderController.getMyOrders);

export default router;
