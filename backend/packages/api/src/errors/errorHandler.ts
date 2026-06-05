import type { ErrorRequestHandler } from "express";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const statusByErrorName: Record<string, number> = {
  ValidationError: 400,
  NotFoundError: 404,
  DatabaseError: 500,
  UnauthorizedError: 401,
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = statusByErrorName[err.name] ?? 500;
  let message = err.message || "Internal server error";

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Video file is too large. Maximum size is 500 MB."
        : err.message;
  }

  if (err.message === "Only video files are allowed") {
    statusCode = 400;
  }
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV !== "production" && err.stack
      ? { stack: err.stack }
      : {}),
  });
};

export default errorHandler;
