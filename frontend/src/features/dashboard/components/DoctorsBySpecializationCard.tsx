"use client";

import ChartCard from "./ChartCard";
import HorizontalBarChart from "./HorizontalBarChart";
import { useDoctorsBySpecialization } from "../hooks";

export default function DoctorsBySpecializationCard() {
  const { data = [], isLoading, isError } = useDoctorsBySpecialization();

  const bars = data.map((item) => ({
    id: item.specialization,
    label: item.specialization,
    value: item.doctors,
  }));

  return (
    <ChartCard
      title="Doctors by specialization"
      subtitle="How your medical staff is distributed"
      isLoading={isLoading}
      isError={isError}
    >
      <HorizontalBarChart data={bars} color="#2f7bdc" valueLabel="Doctors" />
    </ChartCard>
  );
}
