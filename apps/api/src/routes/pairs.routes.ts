import { Router } from "express";
import { getPairByAddress, listPairs } from "../services/pair.service";

export const pairsRouter = Router();

pairsRouter.get("/pairs", async (req, res, next) => {
  try {
    const isValidParam = req.query.isValid;
    const isValid =
      isValidParam === "true" ? true : isValidParam === "false" ? false : undefined;
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    res.json(await listPairs({ isValid, q }));
  } catch (error) {
    next(error);
  }
});

pairsRouter.get("/pairs/:address", async (req, res, next) => {
  try {
    const pair = await getPairByAddress(req.params.address);
    if (!pair) {
      res.status(404).json({ error: "Pair not found" });
      return;
    }
    res.json(pair);
  } catch (error) {
    next(error);
  }
});
