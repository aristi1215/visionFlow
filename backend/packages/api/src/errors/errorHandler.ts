import type { ErrorRequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();

const statusByErrorName: Record<string, number> = {
  ValidationError: 400,
  NotFoundError: 404,
  DatabaseError: 500,
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = statusByErrorName[err.name] ?? 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV !== "production" && err.stack
      ? { stack: err.stack }
      : {}),
  });
};

export default errorHandler;
