import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => issue.message).join(", ");
  }

  // Log error for the developer
  console.error("ERROR 💥:", err);

  // Send response to the client
  res.status(statusCode).json({
    status: statusCode.toString().startsWith("4") ? "fail" : "error",
    message: message,
    // Show stack trace only if we are in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
