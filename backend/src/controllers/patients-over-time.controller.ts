import type { RequestHandler } from "express";
import { Patient } from "../models/patient.model.js";

type Range = "7days" | "30days" | "12months";

// Accept both the long names and the short ones the frontend sends.
const RANGE_ALIASES: Record<string, Range> = {
  "7days": "7days",
  "30days": "30days",
  "12months": "12months",
  "7d": "7days",
  "30d": "30days",
  "12m": "12months",
};

const TIMEZONE = "Asia/Dhaka";

// Format a date as YYYY-MM-DD in the dashboard timezone.
const toDayKey = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

// Today's year/month/day in the dashboard timezone.
const todayParts = (now: Date) => {
  const [year = 0, month = 1, day = 1] = toDayKey(now).split("-").map(Number);
  return { year, month, day };
};

// Build every bucket key in the range so days/months with no patients show as 0.
const buildBuckets = (range: Range, now: Date): string[] => {
  const keys: string[] = [];

  if (range === "12months") {
    const { year, month } = todayParts(now);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(year, month - 1 - i, 1));
      keys.push(d.toISOString().slice(0, 7));
    }
    return keys;
  }

  const days = range === "7days" ? 7 : 30;
  const { year, month, day } = todayParts(now);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - 1, day - i));
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
};

export const getPatientsOverTime: RequestHandler = async (req, res) => {
  try {
    const range = req.query.range ?? "30days";
    const selectedRange =
      typeof range === "string" ? RANGE_ALIASES[range] : undefined;

    if (!selectedRange) {
      res.status(400).json({
        success: false,
        message: "Invalid range. Use 7d, 30d, or 12m.",
      });
      return;
    }

    const now = new Date();
    const startDate = new Date(now);

    let dateFormat: string;

    if (selectedRange === "7days") {
      startDate.setDate(startDate.getDate() - 6);
      dateFormat = "%Y-%m-%d";
    } else if (selectedRange === "30days") {
      startDate.setDate(startDate.getDate() - 29);
      dateFormat = "%Y-%m-%d";
    } else {
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);
      dateFormat = "%Y-%m";
    }

    startDate.setHours(0, 0, 0, 0);

    const results = await Patient.aggregate<{
      date: string;
      count: number;
    }>([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt",
              timezone: TIMEZONE,
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    const counts = new Map(results.map((r) => [r.date, r.count]));
    const data = buildBuckets(selectedRange, now).map((date) => ({
      date,
      count: counts.get(date) ?? 0,
    }));

    res.status(200).json({
      success: true,
      range: selectedRange,
      data,
    });
  } catch (error) {
    console.error("Get patients over time error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve patient statistics.",
    });
  }
};
