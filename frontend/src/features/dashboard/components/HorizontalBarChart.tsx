"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarItem = {
  id: string;
  label: string;
  value: number;
};

type Props = {
  data: BarItem[];
  color: string;
  valueLabel: string;
  onBarClick?: (item: BarItem) => void;
};

// Long doctor names get cut like "Dr. Henrietta May..."
const shorten = (text: string) =>
  text.length > 18 ? `${text.slice(0, 17)}...` : text;

export default function HorizontalBarChart({
  data,
  color,
  valueLabel,
  onBarClick,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} stroke="#eef0f2" />

        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tickFormatter={shorten}
          tick={{ fontSize: 12, fill: "#4b5563" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{ fill: "#f3f4f6" }}
          formatter={(value) => [String(value), valueLabel]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 12,
          }}
        />

        <Bar
          dataKey="value"
          fill={color}
          barSize={18}
          radius={[0, 3, 3, 0]}
          onClick={(_, index) => onBarClick?.(data[index])}
          style={{ cursor: onBarClick ? "pointer" : "default" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
