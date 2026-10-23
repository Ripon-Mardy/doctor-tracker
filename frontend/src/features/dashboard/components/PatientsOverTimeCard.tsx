"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RangeTabs from "./RangeTabs";
import { usePatientsOverTime } from "../hooks";
import type { Range } from "../types";

const PatientsChart = dynamic(() => import("./PatientsChart"), { ssr: false });

const rangeLabel: Record<Range, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "12m": "last 12 months",
};

export default function PatientsOverTimeCard() {
  const [range, setRange] = useState<Range>("30d");
  const { data = [], isLoading, isError, refetch } = usePatientsOverTime(range);
  console.log("data", data);

  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            Patients added over time
          </h3>
          <p className="text-sm text-gray-500">
            {total} new patients in the {rangeLabel[range]}
          </p>
        </div>
        <RangeTabs value={range} onChange={setRange} />
      </div>

      {isLoading && (
        <div className="h-70 animate-pulse rounded-lg bg-gray-100" />
      )}

      {isError && (
        <div className="flex h-70 flex-col items-center justify-center gap-2 text-sm text-gray-500">
          <p>Couldn&apos;t load the chart.</p>
          <button
            onClick={() => refetch()}
            className="font-medium text-gray-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !isError && <PatientsChart data={data} range={range} />}
    </div>
  );
}
