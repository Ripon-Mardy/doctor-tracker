import mongoose from "mongoose";

import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

export interface DashboardDateRange {
  from?: Date | undefined;
  to?: Date | undefined;
}

export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  patientsToday: number;
}

export interface PatientsByDoctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  patientCount: number;
}

export interface PatientsByDate {
  date: string;
  patientCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  patientsByDoctor: PatientsByDoctor[];
  patientsByDate: PatientsByDate[];
}

export async function getDashboardData(
  dateRange: DashboardDateRange = {},
): Promise<DashboardData> {
  const { from, to } = dateRange;

  const patientDateFilter: Record<string, unknown> = {};

  if (from || to) {
    patientDateFilter.createdAt = {};

    if (from) {
      (patientDateFilter.createdAt as Record<string, Date>).$gte = from;
    }

    if (to) {
      (patientDateFilter.createdAt as Record<string, Date>).$lte = to;
    }
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    totalDoctors,
    totalPatients,
    patientsToday,
    patientsByDoctor,
    patientsByDate,
  ] = await Promise.all([
    Doctor.countDocuments(),

    Patient.countDocuments(patientDateFilter),

    Patient.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }),

    Patient.aggregate([
      ...(Object.keys(patientDateFilter).length > 0
        ? [{ $match: patientDateFilter }]
        : []),

      {
        $group: {
          _id: "$doctor",
          patientCount: {
            $sum: 1,
          },
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

      {
        $unwind: "$doctor",
      },

      {
        $project: {
          _id: 0,
          doctorId: {
            $toString: "$_id",
          },
          doctorName: "$doctor.name",
          specialization: "$doctor.specialization",
          patientCount: 1,
        },
      },

      {
        $sort: {
          patientCount: -1,
        },
      },
    ]),

    Patient.aggregate([
      ...(Object.keys(patientDateFilter).length > 0
        ? [{ $match: patientDateFilter }]
        : []),

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          patientCount: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          date: "$_id",
          patientCount: 1,
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
    ]),
  ]);

  return {
    summary: {
      totalDoctors,
      totalPatients,
      patientsToday,
    },

    patientsByDoctor: patientsByDoctor.map((item) => ({
      doctorId: String(item.doctorId),
      doctorName: String(item.doctorName),
      specialization: String(item.specialization),
      patientCount: Number(item.patientCount),
    })),

    patientsByDate: patientsByDate.map((item) => ({
      date: String(item.date),
      patientCount: Number(item.patientCount),
    })),
  };
}
