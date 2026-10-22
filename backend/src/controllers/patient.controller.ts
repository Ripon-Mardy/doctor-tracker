import mongoose from "mongoose";
import type { RequestHandler } from "express";

import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";

import {
  validatePatientInput,
  validatePatientUpdate,
} from "../validators/patient.validator.js";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidationError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "ValidationError" ||
    error.message.includes(" is required") ||
    error.message.includes(" must ") ||
    error.message.startsWith("Enter a valid") ||
    error.message.startsWith("A valid") ||
    error.message.startsWith("Provide at least") ||
    error.message.startsWith("Unsupported")
  );
}

// create patient
export const createPatient: RequestHandler = async (req, res) => {
  try {
    const input = validatePatientInput(req.body);

    if (!mongoose.isValidObjectId(input.doctor)) {
      res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
      return;
    }

    const doctor = await Doctor.findById(input.doctor);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    const patient = await Patient.create({
      ...input,
      doctor: input.doctor,
    });

    const populatedPatient = await patient.populate(
      "doctor",
      "name specialization hospital",
    );

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient: populatedPatient,
    });
  } catch (error: unknown) {
    if (isValidationError(error)) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid patient data",
      });
      return;
    }

    console.error("Create patient failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create patient",
    });
  }
};

// get patients
export const getPatients: RequestHandler = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const condition =
      typeof req.query.condition === "string" ? req.query.condition.trim() : "";

    const doctor =
      typeof req.query.doctor === "string" ? req.query.doctor.trim() : "";

    const gender =
      typeof req.query.gender === "string"
        ? req.query.gender.trim().toLowerCase()
        : "";

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
        { phone: safeSearch },
        { condition: safeSearch },
      ];
    }

    if (condition) {
      filter.condition = new RegExp(escapeRegex(condition), "i");
    }

    if (gender) {
      if (!["male", "female", "other"].includes(gender)) {
        res.status(400).json({
          success: false,
          message: "Invalid gender filter",
        });
        return;
      }

      filter.gender = gender;
    }

    if (doctor) {
      if (!mongoose.isValidObjectId(doctor)) {
        res.status(400).json({
          success: false,
          message: "Invalid doctor ID",
        });
        return;
      }

      filter.doctor = doctor;
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

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate("doctor", "name specialization hospital")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Patient.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Get patients failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve patients",
    });
  }
};

// get patient By id
export const getPatientById: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid patient ID",
    });
    return;
  }

  try {
    const patient = await Patient.findById(id)
      .populate("doctor", "name specialization hospital")
      .lean();

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error: unknown) {
    console.error("Get patient failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve patient",
    });
  }
};

// update patient
export const updatePatient: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid patient ID",
    });
    return;
  }

  try {
    const updates = validatePatientUpdate(req.body);

    if (updates.doctor) {
      if (!mongoose.isValidObjectId(updates.doctor)) {
        res.status(400).json({
          success: false,
          message: "Invalid doctor ID",
        });
        return;
      }

      const doctor = await Doctor.findById(updates.doctor);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
        return;
      }
    }

    const patient = await Patient.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("doctor", "name specialization hospital");

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error: unknown) {
    if (isValidationError(error)) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid patient data",
      });
      return;
    }

    console.error("Update patient failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update patient",
    });
  }
};

// delete patient
export const deletePatient: RequestHandler = async (req, res) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid patient ID",
    });
    return;
  }

  try {
    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Delete patient failed:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete patient",
    });
  }
};
