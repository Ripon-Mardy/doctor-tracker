"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { deleteDoctor } from "@/lib/doctors";
import type { Doctor } from "@/types/doctor";

interface DeleteDoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onDeleted: (doctor: Doctor) => void;
}

export function DeleteDoctorModal({ doctor, onClose, onDeleted }: DeleteDoctorModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!doctor) return;

    setDeleting(true);
    setError("");

    try {
      await deleteDoctor(doctor._id);
      onDeleted(doctor);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete doctor");
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    if (deleting) return;
    setError("");
    onClose();
  }

  return (
    <Modal
      open={Boolean(doctor)}
      onClose={handleClose}
      title={`Delete ${doctor?.name ?? "doctor"}?`}
      description="This permanently removes the doctor. This action cannot be undone."
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClose}
          disabled={deleting}
          className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
          {deleting ? "Deleting…" : "Delete doctor"}
        </button>
      </div>
    </Modal>
  );
}
