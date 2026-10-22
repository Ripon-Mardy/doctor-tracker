import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.middleware";
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from "../controllers/doctor.controller";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getDoctors);
router.post("/", createDoctor);
router.get("/:id", getDoctorById);
router.patch("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
