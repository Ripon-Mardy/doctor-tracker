import type { RequestHandler } from "express";
import { Doctor } from "../models/doctor.model.js";

export const getDoctorsBySpecialization: RequestHandler = async (_req, res) => {
  try {
    const data = await Doctor.aggregate([
      {
        $group: {
          _id: "$specialization",
          doctors: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          specialization: "$_id",
          doctors: 1,
        },
      },
      {
        $sort: {
          doctors: -1,
          specialization: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Doctors by specialization error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors by specialization.",
    });
  }
};
