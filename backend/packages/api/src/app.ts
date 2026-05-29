import express from "express";
import  apiRouter  from "./routes/api.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/v1", apiRouter);

  return app;
}
