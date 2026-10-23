"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Modal } from "@/components/shared/Modal";
import { createPatient, updatePatient } from "@/lib/patients";
import type { Doctor } from "@/types/doctor";
import type { Patient, PatientGender } from "@/types/patient";

// age is a string while typing, we turn it into a number on submit
interface FormState {
  name: string;
  age: string;
  gender: PatientGender | "";
  phone: string;
  condition: string;
  doctor: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

interface PatientFormModalProps {
  open: boolean;
  onClose: () => void;
  // pass a patient to edit, leave it empty to create
  patient?: Patient | null;
  doctors: Doctor[];
  onSaved: (patient: Patient) => void;
}

export function PatientFormModal({
  open,
  onClose,
  patient,
  doctors,
  onSaved,
}: PatientFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={patient ? "Edit patient" : "Add patient"}
      description={
        patient ? "Update this patient's details." : "Add a new patient and assign a doctor."
      }
    >
      {/* key resets the form every time we switch patient */}
      <PatientForm
        key={patient?._id ?? "new"}
        patient={patient}
        doctors={doctors}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Modal>
  );
}

function validate(values: FormState) {
  const errors: FormErrors = {};
  const age = Number(values.age);

  if (!values.name.trim()) errors.name = "Name is required";
  if (values.age === "" || !Number.isInteger(age) || age < 0 || age > 150) {
    errors.age = "Age must be a whole number between 0 and 150";
  }
  if (!values.gender) errors.gender = "Pick a gender";
  if (!/^[+\d\s().-]+$/.test(values.phone.trim())) errors.phone = "Enter a valid phone number";
  if (!values.condition.trim()) errors.condition = "Condition is required";
  if (!values.doctor) errors.doctor = "Pick a doctor";

  return errors;
}

function PatientForm({
  patient,
  doctors,
  onClose,
  onSaved,
}: Omit<PatientFormModalProps, "open">) {
  const [values, setValues] = useState<FormState>({
    name: patient?.name ?? "",
    age: patient ? String(patient.age) : "",
    gender: patient?.gender ?? "",
    phone: patient?.phone ?? "",
    condition: patient?.condition ?? "",
    doctor: patient?.doctor?._id ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name: values.name.trim(),
      age: Number(values.age),
      gender: values.gender as PatientGender,
      phone: values.phone.trim(),
      condition: values.condition.trim(),
      doctor: values.doctor,
    };

    setSaving(true);
    setServerError("");

    try {
      const saved = patient
        ? await updatePatient(patient._id, payload)
        : await createPatient(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not save patient");
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
        <label htmlFor="patient-name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          id="patient-name"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Smith"
          className={inputClass(Boolean(errors.name))}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="patient-age" className="mb-1.5 block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            id="patient-age"
            type="number"
            min={0}
            max={150}
            value={values.age}
            onChange={(e) => handleChange("age", e.target.value)}
            placeholder="42"
            className={inputClass(Boolean(errors.age))}
          />
          {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="patient-gender" className="mb-1.5 block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="patient-gender"
            value={values.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className={inputClass(Boolean(errors.gender))}
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="patient-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="patient-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
            className={inputClass(Boolean(errors.phone))}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label
            htmlFor="patient-condition"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Condition
          </label>
          <input
            id="patient-condition"
            value={values.condition}
            onChange={(e) => handleChange("condition", e.target.value)}
            placeholder="Hypertension"
            className={inputClass(Boolean(errors.condition))}
          />
          {errors.condition && <p className="mt-1 text-xs text-red-600">{errors.condition}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="patient-doctor" className="mb-1.5 block text-sm font-medium text-gray-700">
          Doctor
        </label>
        <select
          id="patient-doctor"
          value={values.doctor}
          onChange={(e) => handleChange("doctor", e.target.value)}
          className={inputClass(Boolean(errors.doctor))}
        >
          <option value="">Select a doctor…</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} — {d.specialization}
            </option>
          ))}
        </select>
        {errors.doctor && <p className="mt-1 text-xs text-red-600">{errors.doctor}</p>}
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
          {patient ? (saving ? "Saving…" : "Save changes") : saving ? "Adding…" : "Add patient"}
        </button>
      </div>
    </form>
  );
}
