import { Router } from "express";

import { authenticateAdmin } from "../middleware/auth.middleware.js";

import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";

const router = Router();

router.use(authenticateAdmin);

router.get("/", getPatients);

router.post("/", createPatient);

router.get("/:id", getPatientById);

router.patch("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;
