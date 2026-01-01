import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "@controllers/../services/auth.service.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";
import { AppError } from "../utils/app-error.js";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await authService.signup(validatedData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            "Validation failed: " + error.issues.map((issue) => issue.message).join(", "),
            400
          )
        );
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new AppError(
            "Validation failed: " + error.issues.map((issue) => issue.message).join(", "),
            400
          )
        );
      }
      next(error);
    }
  }

  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const user = await authService.getUserById(req.userId);
      if (!user) return next(new AppError("User not found", 404));
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
