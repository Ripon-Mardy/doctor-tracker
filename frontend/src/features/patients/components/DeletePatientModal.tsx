"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { deletePatient } from "@/lib/patients";
import type { Patient } from "@/types/patient";

interface DeletePatientModalProps {
  patient: Patient | null;
  onClose: () => void;
  onDeleted: (patient: Patient) => void;
}

export function DeletePatientModal({ patient, onClose, onDeleted }: DeletePatientModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!patient) return;

    setDeleting(true);
    setError("");

    try {
      await deletePatient(patient._id);
      onDeleted(patient);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete patient");
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
      open={Boolean(patient)}
      onClose={handleClose}
      title={`Delete ${patient?.name ?? "patient"}?`}
      description="This permanently removes the patient's record. This action cannot be undone."
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
          {deleting ? "Deleting…" : "Delete patient"}
        </button>
      </div>
    </Modal>
  );
}
