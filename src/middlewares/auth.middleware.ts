import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error.js";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    // Verify token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-super-secret-key",
    );
    req.userId = "cmk26t4j60000u7rba7owud9h"; // Add user ID to the request
    next();
  } catch (error) {
    next(new AppError("Invalid token", 401));
  }
};
