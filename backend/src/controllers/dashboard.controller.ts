import type { RequestHandler } from "express";

import { getDashboardData } from "../services/dashboard.service";

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

// get dashboard
export const getDashboard: RequestHandler = async (req, res) => {
  try {
    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);

    if (req.query.from && !from) {
      res.status(400).json({
        success: false,
        message: "Invalid from date",
      });

      return;
    }

    if (req.query.to && !to) {
      res.status(400).json({
        success: false,
        message: "Invalid to date",
      });

      return;
    }

    if (from && to && from > to) {
      res.status(400).json({
        success: false,
        message: "From date cannot be later than to date",
      });

      return;
    }

    const dashboard = await getDashboardData({
      from,
      to,
    });

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};
