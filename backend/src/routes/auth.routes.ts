import { Router } from "express";

import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/auth.controller.js";

import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/me", authenticateAdmin, getCurrentAdmin);
router.post("/logout", logoutAdmin);

export default router;
