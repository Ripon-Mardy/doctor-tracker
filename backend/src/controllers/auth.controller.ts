import type { RequestHandler } from "express";

import { Admin } from "../models/admin.model.js";
import { comparePassword } from "../utils/password.js";
import { createAuthToken } from "../utils/jwt.js";

const COOKIE_NAME = "doctor_tracker_token";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// login route
export const loginAdmin: RequestHandler = async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await comparePassword(password, admin.password))) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = createAuthToken(admin._id.toString());

    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: ONE_DAY_MS,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error: unknown) {
    console.error("Admin login failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log in right now",
    });
  }
};

// me
export const getCurrentAdmin: RequestHandler = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin?.id);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Admin account not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error: unknown) {
    console.error("Fetching current admin failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve admin account",
    });
  }
};

export const logoutAdmin: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
