import type { RequestHandler } from "express";
import { Patient } from "../models/patient.model.js";

export const getPatientsPerDoctor: RequestHandler = async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1 ||
      requestedLimit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100.",
      });
      return;
    }

    const data = await Patient.aggregate([
      {
        $group: {
          _id: "$doctor",
          patients: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          _id: 0,
          doctorId: { $toString: "$doctor._id" },
          name: "$doctor.name",
          patients: 1,
        },
      },
      {
        $sort: {
          patients: -1,
          name: 1,
        },
      },
      { $limit: requestedLimit },
    ]);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Patients per doctor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patients per doctor.",
    });
  }
};
