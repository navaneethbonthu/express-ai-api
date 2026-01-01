import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await authService.signup(validatedData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
