import { Router } from "express";

import { authenticateAdmin } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { getPatientsOverTime } from "../controllers/patients-over-time.controller.js";
import { getDashboardStats } from "../controllers/dashboard-stats.controller.js";
import { getPatientsPerDoctor } from "../controllers/patients-per-doctor.controller.js";
import { getDoctorsBySpecialization } from "../controllers/doctors-by-specialization.controller.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDashboard);
router.get("/patients-over-time", getPatientsOverTime);
router.get("/stats", getDashboardStats);
router.get("/patients-per-doctor", getPatientsPerDoctor);
router.get("/by-specialization", getDoctorsBySpecialization);

export default router;
