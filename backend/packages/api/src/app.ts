import express from "express";
import  apiRouter  from "./routes/api.js";
import dotenv from "dotenv";
import errorHandler from "./errors/errorHandler.js";
dotenv.config();

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/v1", apiRouter);
  app.use(errorHandler);

  return app;
}
 