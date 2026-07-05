import { Router } from "express";
import type { ActivityType } from "@obscura/shared";
import { listActivity } from "../services/activity.service";

const VALID_TYPES: ActivityType[] = [
  "wrap",
  "unwrap_requested",
  "unwrap_finalized",
  "pair_registered",
  "pair_revoked",
];

export const activityRouter = Router();

activityRouter.get("/activity", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize ?? 20) || 20));
    const typeParam =
      typeof req.query.type === "string" &&
      (VALID_TYPES as string[]).includes(req.query.type)
        ? (req.query.type as ActivityType)
        : undefined;
    const pair = typeof req.query.pair === "string" ? req.query.pair : undefined;
    const actor = typeof req.query.actor === "string" ? req.query.actor : undefined;

    const { events, total } = await listActivity({
      pair,
      type: typeParam,
      actor,
      page,
      pageSize,
    });
    res.json({ events, page, pageSize, total });
  } catch (error) {
    next(error);
  }
});
