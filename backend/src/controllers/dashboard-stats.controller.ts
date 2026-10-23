import type { RequestHandler } from "express";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

export const getDashboardStats: RequestHandler = async (_req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      totalDoctors,
      totalPatients,
      newThisMonth,
      previousMonthPatients,
      activePatients,
    ] = await Promise.all([
      Doctor.countDocuments(),

      Patient.countDocuments(),

      Patient.countDocuments({
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      }),

      Patient.countDocuments({
        createdAt: {
          $gte: startOfPreviousMonth,
          $lt: startOfMonth,
        },
      }),

      Patient.countDocuments({
        createdAt: { $gte: last30Days, $lte: now },
      }),
    ]);

    const monthlyChange =
      previousMonthPatients === 0
        ? newThisMonth > 0
          ? 100
          : 0
        : Number(
            (
              ((newThisMonth - previousMonthPatients) / previousMonthPatients) *
              100
            ).toFixed(1),
          );

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        totalPatients,
        newThisMonth,
        monthlyChange,
        activePatients,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};
