"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserX } from "lucide-react";

import { DeleteDoctorModal } from "@/features/doctors/components/DeleteDoctorModal";
import { DoctorFormModal } from "@/features/doctors/components/DoctorFormModal";
import {
  DoctorInfoCard,
  DoctorInfoCardSkeleton,
} from "@/features/doctors/components/DoctorInfoCard";
import { DoctorPatients } from "@/features/doctors/components/DoctorPatients";
import { useDoctor } from "@/features/doctors/hooks/useDoctor";
import type { Doctor } from "@/types/doctor";

const DoctorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { doctor, error, isLoading, refetch } = useDoctor(id);

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  const backLink = (
    <Link
      href="/doctors"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to doctors
    </Link>
  );

  if (isLoading && !doctor) {
    return (
      <div className="space-y-6">
        {backLink}
        <DoctorInfoCardSkeleton />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="space-y-6">
        {backLink}
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-4 py-12 text-center">
          <UserX className="h-8 w-8 text-gray-400" aria-hidden />
          <p className="mt-3 font-medium text-gray-900">Couldn&apos;t load this doctor</p>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {backLink}

      <DoctorInfoCard
        doctor={doctor}
        onEdit={() => setEditOpen(true)}
        onDelete={() => setDeleting(doctor)}
      />

      <DoctorPatients doctorId={doctor._id} />

      <DoctorFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        doctor={doctor}
        onSaved={refetch}
      />

      <DeleteDoctorModal
        doctor={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => router.replace("/doctors")}
      />
    </div>
  );
};

export default DoctorDetailPage;
