import { UserController } from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));

export default router;
