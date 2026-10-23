"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { createDoctor, updateDoctor } from "@/lib/doctors";
import type { Doctor, DoctorFormValues } from "@/types/doctor";

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "General Medicine",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
];

const EMPTY_FORM: DoctorFormValues = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

interface DoctorFormModalProps {
  open: boolean;
  onClose: () => void;
  // pass a doctor to edit, leave it empty to create
  doctor?: Doctor | null;
  onSaved: (doctor: Doctor) => void;
}

export function DoctorFormModal({ open, onClose, doctor, onSaved }: DoctorFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={doctor ? "Edit doctor" : "Add doctor"}
      description={
        doctor
          ? "Update this doctor's profile and contact details."
          : "Add a new doctor to your directory."
      }
    >
      {/* key resets the form every time we switch doctor */}
      <DoctorForm key={doctor?._id ?? "new"} doctor={doctor} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}

function validate(values: DoctorFormValues) {
  const errors: Partial<Record<keyof DoctorFormValues, string>> = {};

  if (values.name.trim().length < 2) errors.name = "Name must have at least 2 characters";
  if (!values.specialization) errors.specialization = "Pick a specialization";
  if (!values.hospital.trim()) errors.hospital = "Hospital is required";
  if (!/^[+\d\s().-]+$/.test(values.phone.trim())) errors.phone = "Enter a valid phone number";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  return errors;
}

function DoctorForm({
  doctor,
  onClose,
  onSaved,
}: Omit<DoctorFormModalProps, "open">) {
  const [values, setValues] = useState<DoctorFormValues>(
    doctor
      ? {
          name: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
          phone: doctor.phone,
          email: doctor.email,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof DoctorFormValues, string>>>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  // if a doctor has a specialization that's not in our list, still show it
  const specializations =
    doctor && !SPECIALIZATIONS.includes(doctor.specialization)
      ? [...SPECIALIZATIONS, doctor.specialization]
      : SPECIALIZATIONS;

  function handleChange(field: keyof DoctorFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    setServerError("");

    try {
      const saved = doctor
        ? await updateDoctor(doctor._id, values)
        : await createDoctor(values);
      onSaved(saved);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not save doctor");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = (hasError: boolean) =>
    `h-9 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 ${
      hasError
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="doctor-name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          id="doctor-name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Dr. Jane Cooper"
          className={inputClass(Boolean(errors.name))}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="doctor-specialization"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Specialization
          </label>
          <select
            id="doctor-specialization"
            value={values.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            className={inputClass(Boolean(errors.specialization))}
          >
            <option value="">Select…</option>
            {specializations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.specialization && (
            <p className="mt-1 text-xs text-red-600">{errors.specialization}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="doctor-hospital"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Hospital
          </label>
          <input
            id="doctor-hospital"
            value={values.hospital}
            onChange={(e) => handleChange("hospital", e.target.value)}
            placeholder="Riverside Medical Center"
            className={inputClass(Boolean(errors.hospital))}
          />
          {errors.hospital && <p className="mt-1 text-xs text-red-600">{errors.hospital}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="doctor-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="doctor-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className={inputClass(Boolean(errors.phone))}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="doctor-email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="doctor-email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="jane.cooper@hospital.com"
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {doctor ? (saving ? "Saving…" : "Save changes") : saving ? "Adding…" : "Add doctor"}
        </button>
      </div>
    </form>
  );
}
