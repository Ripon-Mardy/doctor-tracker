"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { PageHeader } from "@/components/shared/page-header";
import PatientsOverTimeCard from "@/features/dashboard/components/PatientsOverTimeCard";
import StatsGrid from "@/features/dashboard/components/StatsGrid";

const formatDay = (value: string) => format(parseISO(value), "MMM d, yyyy");

function describeRange(from: string | null, to: string | null) {
  if (!from || !to) return "An overview of your doctors and patients";
  if (from === to) return `Showing activity for ${formatDay(from)}`;
  return `Showing activity from ${formatDay(from)} to ${formatDay(to)}`;
}

const DashboardPage = () => {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* page header  */}
      <PageHeader
        title="Dashboard"
        description={describeRange(from, to)}
        actions={
          <DateRangePicker
            label="Dashboard period"
            placeholder="All time"
            align="end"
            from={from}
            to={to}
            onChange={(nextFrom, nextTo) => {
              setFrom(nextFrom);
              setTo(nextTo);
            }}
            className="w-full sm:w-auto sm:min-w-56"
          />
        }
      />

      <StatsGrid />

      {/* patient over time card  */}
      <PatientsOverTimeCard />
    </div>
  );
};

export default DashboardPage;
