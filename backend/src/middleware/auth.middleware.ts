import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { getJwtSecret } from "../utils/jwt.js";

export const authenticateAdmin: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.doctor_tracker_token;

  if (typeof token !== "string") {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded === "string" || typeof decoded.sub !== "string") {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    req.admin = { id: decoded.sub };
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
