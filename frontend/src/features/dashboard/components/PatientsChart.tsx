"use client";

import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PatientsOverTimePoint, Range } from "../types";

const COLOR = "#0f8a7e";

type Props = {
  data: PatientsOverTimePoint[];
  range: Range;
};

export default function PatientsChart({ data, range }: Props) {
  const formatTick = (date: string) =>
    format(new Date(date), range === "12m" ? "MMM" : "MMM d");

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR} stopOpacity={0.15} />
            <stop offset="100%" stopColor={COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#eef0f2" />

        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          minTickGap={20}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          labelFormatter={(label) =>
            format(new Date(String(label)), "MMM d, yyyy")
          }
          formatter={(value) => [String(value), "Patients"]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
        />

        <Area
          type="monotone"
          dataKey="count"
          stroke={COLOR}
          strokeWidth={2}
          fill="url(#patientsFill)"
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
