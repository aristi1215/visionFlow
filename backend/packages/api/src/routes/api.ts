import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ message: "OndeckAI API" });
});

export default router;
