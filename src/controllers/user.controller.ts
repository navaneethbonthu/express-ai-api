import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { AppError } from "../utils/app-error.js";

const userService = new UserService();

export class UserController {
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        return next(new AppError("User id is required", 400));
      }
      const user = await userService.getUserById(id);
      if (user) {
        res.json(user);
      } else {
        return next(new AppError("User not found", 404));
      }
    } catch (error) {
      next(error);
    }
  }
}
