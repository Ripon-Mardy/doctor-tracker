export type PatientGender = "male" | "female" | "other";

export interface PatientInput {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  condition: string;
  doctor: string;
}

const VALID_GENDERS: PatientGender[] = ["male", "female", "other"];

const PHONE_PATTERN = /^[+\d\s().-]+$/;

function readString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const result = value.trim();

  if (!result) {
    throw new Error(`${field} is required`);
  }

  if (result.length > maxLength) {
    throw new Error(`${field} must be at most ${maxLength} characters`);
  }

  return result;
}

export function validatePatientInput(body: unknown): PatientInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("A valid patient object is required");
  }

  const input = body as Record<string, unknown>;

  const name = readString(input.name, "Name", 100);

  const age = typeof input.age === "number" ? input.age : Number(input.age);

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    throw new Error("Age must be a whole number between 0 and 150");
  }

  const gender = readString(input.gender, "Gender", 20).toLowerCase();

  if (!VALID_GENDERS.includes(gender as PatientGender)) {
    throw new Error("Gender must be male, female, or other");
  }

  const phone = readString(input.phone, "Phone", 30);

  if (!PHONE_PATTERN.test(phone)) {
    throw new Error("Enter a valid phone number");
  }

  const condition = readString(input.condition, "Condition", 150);

  const doctor = readString(input.doctor, "Doctor", 100);

  return {
    name,
    age,
    gender: gender as PatientGender,
    phone,
    condition,
    doctor,
  };
}

export function validatePatientUpdate(body: unknown): Partial<PatientInput> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("A valid update object is required");
  }

  const input = body as Record<string, unknown>;

  const allowedFields = [
    "name",
    "age",
    "gender",
    "phone",
    "condition",
    "doctor",
  ];

  const keys = Object.keys(input);

  if (keys.length === 0) {
    throw new Error("Provide at least one field to update");
  }

  for (const key of keys) {
    if (!allowedFields.includes(key)) {
      throw new Error(`Unsupported field: ${key}`);
    }
  }

  const result: Partial<PatientInput> = {};

  if ("name" in input) {
    result.name = readString(input.name, "Name", 100);
  }

  if ("age" in input) {
    const age = typeof input.age === "number" ? input.age : Number(input.age);

    if (!Number.isInteger(age) || age < 0 || age > 150) {
      throw new Error("Age must be a whole number between 0 and 150");
    }

    result.age = age;
  }

  if ("gender" in input) {
    const gender = readString(input.gender, "Gender", 20).toLowerCase();

    if (!VALID_GENDERS.includes(gender as PatientGender)) {
      throw new Error("Gender must be male, female, or other");
    }

    result.gender = gender as PatientGender;
  }

  if ("phone" in input) {
    const phone = readString(input.phone, "Phone", 30);

    if (!PHONE_PATTERN.test(phone)) {
      throw new Error("Enter a valid phone number");
    }

    result.phone = phone;
  }

  if ("condition" in input) {
    result.condition = readString(input.condition, "Condition", 150);
  }

  if ("doctor" in input) {
    result.doctor = readString(input.doctor, "Doctor", 100);
  }

  return result;
}
