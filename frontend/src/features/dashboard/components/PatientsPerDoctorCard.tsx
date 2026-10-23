"use client";

import { useRouter } from "next/navigation";
import ChartCard from "./ChartCard";
import HorizontalBarChart from "./HorizontalBarChart";
import { usePatientsPerDoctor } from "../hooks";

export default function PatientsPerDoctorCard() {
  const router = useRouter();
  const { data = [], isLoading, isError } = usePatientsPerDoctor();

  const bars = data.map((doctor) => ({
    id: doctor.doctorId,
    label: doctor.name,
    value: doctor.patients,
  }));

  return (
    <ChartCard
      title="Patients per doctor"
      subtitle="Top 10 doctors by patient load — click a bar to open the doctor"
      isLoading={isLoading}
      isError={isError}
    >
      <HorizontalBarChart
        data={bars}
        color="#0f8a7e"
        valueLabel="Patients"
        onBarClick={(bar) => router.push(`/doctors/${bar.id}`)}
      />
    </ChartCard>
  );
}
