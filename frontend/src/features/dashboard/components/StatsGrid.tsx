"use client";

import {
  Activity,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import StatCard from "./StatCard";
import { useDashboardStats } from "../hooks";

function ChangeBadge({ change }: { change: number }) {
  const isUp = change >= 0;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium ${
          isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
        }`}
      >
        <Icon className="h-3 w-3" />
        {isUp ? "+" : ""}
        {change}%
      </span>
      vs last month
    </span>
  );
}

export default function StatsGrid() {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[134px] animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-red-600">Couldn&apos;t load stats.</p>;
  }

  const activePercent = data.totalPatients
    ? Math.round((data.activePatients / data.totalPatients) * 100)
    : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total doctors"
        value={data.totalDoctors}
        icon={Stethoscope}
        footer="Across all hospitals"
      />
      <StatCard
        title="Total patients"
        value={data.totalPatients}
        icon={Users}
        footer="All time"
      />
      <StatCard
        title="New this month"
        value={data.newThisMonth}
        icon={UserPlus}
        footer={<ChangeBadge change={data.monthlyChange} />}
      />
      <StatCard
        title="Active patients"
        value={data.activePatients}
        icon={Activity}
        footer={`${activePercent}% of patients, added in the last 30 days`}
      />
    </div>
  );
}
