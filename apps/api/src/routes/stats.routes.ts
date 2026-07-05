import { Router } from "express";
import { getGlobalStats } from "../services/stats.service";

export const statsRouter = Router();

statsRouter.get("/stats", async (_req, res, next) => {
  try {
    res.json(await getGlobalStats());
  } catch (error) {
    next(error);
  }
});
