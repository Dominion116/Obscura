import { Router } from "express";
import { getTvsHistory } from "../services/tvs.service";

export const tvsRouter = Router();

tvsRouter.get("/tvs/:address", async (req, res, next) => {
  try {
    const from = typeof req.query.from === "string" ? new Date(req.query.from) : undefined;
    const to = typeof req.query.to === "string" ? new Date(req.query.to) : undefined;
    res.json(await getTvsHistory(req.params.address, from, to));
  } catch (error) {
    next(error);
  }
});
