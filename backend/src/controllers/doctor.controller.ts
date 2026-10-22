import mongoose from "mongoose";
import type { RequestHandler } from "express";

import { Doctor } from "../models/doctor.model.js";
import {
  validateDoctorInput,
  validateDoctorUpdate,
} from "../validators/doctor.validator.js";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function validationError(message: string) {
  return { statusCode: 400, message };
}

// create doctor
export const createDoctor: RequestHandler = async (req, res) => {
  try {
    const input = validateDoctorInput(req.body);
    const doctor = await Doctor.create(input);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.name === "ValidationError" ||
        error.message.includes(" is required") ||
        error.message.includes(" must ") ||
        error.message.startsWith("Enter a valid") ||
        error.message.startsWith("A valid")
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    console.error("Create doctor failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create doctor",
    });
  }
};

// get doctor
export const getDoctors: RequestHandler = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const specialization =
      typeof req.query.specialization === "string"
        ? req.query.specialization.trim()
        : "";

    const hospital =
      typeof req.query.hospital === "string" ? req.query.hospital.trim() : "";

    const from = typeof req.query.from === "string" ? req.query.from : "";

    const to = typeof req.query.to === "string" ? req.query.to : "";

    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.limit ?? "10"), 10) || 10),
    );

    const filter: Record<string, unknown> = {};

    if (search) {
      const safeSearch = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { name: safeSearch },
        { specialization: safeSearch },
        { hospital: safeSearch },
        { email: safeSearch },
      ];
    }

    if (specialization) {
      filter.specialization = new RegExp(
        `^${escapeRegex(specialization)}$`,
        "i",
      );
    }

    if (hospital) {
      filter.hospital = new RegExp(escapeRegex(hospital), "i");
    }

    if (from || to) {
      const createdAt: Record<string, Date> = {};

      if (from) {
        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
          res.status(400).json({
            success: false,
            message: "Invalid from date",
          });
          return;
        }

        createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
          res.status(400).json({
            success: false,
            message: "Invalid to date",
          });
          return;
        }

        // Include the entire selected calendar day.
        toDate.setUTCHours(23, 59, 59, 999);
        createdAt.$lte = toDate;
      }

      if (from && to && new Date(from) > new Date(to)) {
        res.status(400).json({
          success: false,
          message: "'from' date must not be after 'to' date",
        });
        return;
      }

      filter.createdAt = createdAt;
    }

    const [doctors, total] = await Promise.all([
      Doctor.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Doctor.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Get doctors failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve doctors",
    });
  }
};

// get doctor by id
export const getDoctorById: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
    return;
  }

  try {
    const doctor = await Doctor.findById(id).lean();

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error: unknown) {
    console.error("Get doctor failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve doctor",
    });
  }
};

// update doctor
export const updateDoctor: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
    return;
  }

  try {
    const updates = validateDoctorUpdate(req.body);

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (
        error.name === "ValidationError" ||
        error.message.includes(" is required") ||
        error.message.includes(" must ") ||
        error.message.startsWith("Enter a valid") ||
        error.message.startsWith("Provide at least") ||
        error.message.startsWith("Unsupported field") ||
        error.message.startsWith("A valid")
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
    }

    console.error("Update doctor failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update doctor",
    });
  }
};

// delete doctor
export const deleteDoctor: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid doctor ID",
    });
    return;
  }

  try {
    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete doctor failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete doctor",
    });
  }
};
