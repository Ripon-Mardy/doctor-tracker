import { Router } from "express";

import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDashboard);

export default router;
