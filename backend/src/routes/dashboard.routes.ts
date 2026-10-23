import { Router } from "express";

import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { getPatientsOverTime } from "../controllers/patients-over-time.controller.js";
import { getDashboardStats } from "../controllers/dashboard-stats.controller.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDashboard);
router.get("/patients-over-time", getPatientsOverTime);
router.get("/stats", getDashboardStats);

export default router;
