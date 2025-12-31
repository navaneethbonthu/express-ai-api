import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

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
