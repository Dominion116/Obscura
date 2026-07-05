import { Router } from "express";
import { healthRouter } from "./health.routes";
import { statsRouter } from "./stats.routes";
import { pairsRouter } from "./pairs.routes";
import { activityRouter } from "./activity.routes";
import { tvsRouter } from "./tvs.routes";

export const apiRouter = Router();
apiRouter.use(healthRouter);
apiRouter.use(statsRouter);
apiRouter.use(pairsRouter);
apiRouter.use(activityRouter);
apiRouter.use(tvsRouter);
