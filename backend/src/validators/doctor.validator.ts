export interface DoctorInput {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// validate doctor input function
export function validateDoctorInput(body: unknown): DoctorInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("A valid doctor object is required");
  }

  const input = body as Record<string, unknown>;

  const name = readString(input.name, "Name", 100);
  const specialization = readString(
    input.specialization,
    "Specialization",
    100,
  );
  const hospital = readString(input.hospital, "Hospital", 150);
  const phone = readString(input.phone, "Phone", 30);
  const email = readString(input.email, "Email", 254).toLowerCase();

  if (name.length < 2) {
    throw new Error("Name must contain at least 2 characters");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Enter a valid email address");
  }

  if (!/^[+\d\s().-]+$/.test(phone)) {
    throw new Error("Enter a valid phone number");
  }

  return {
    name,
    specialization,
    hospital,
    phone,
    email,
  };
}

// validate doctor update function
export function validateDoctorUpdate(body: unknown): Partial<DoctorInput> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("A valid update object is required");
  }

  const input = body as Record<string, unknown>;
  const allowedFields = [
    "name",
    "specialization",
    "hospital",
    "phone",
    "email",
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

  const result: Partial<DoctorInput> = {};

  for (const key of keys) {
    const value = input[key];

    switch (key) {
      case "name": {
        const name = readString(value, "Name", 100);

        if (name.length < 2) {
          throw new Error("Name must contain at least 2 characters");
        }

        result.name = name;
        break;
      }
      case "specialization":
        result.specialization = readString(value, "Specialization", 100);
        break;
      case "hospital":
        result.hospital = readString(value, "Hospital", 150);
        break;
      case "phone": {
        const phone = readString(value, "Phone", 30);

        if (!/^[+\d\s().-]+$/.test(phone)) {
          throw new Error("Enter a valid phone number");
        }

        result.phone = phone;
        break;
      }
      case "email": {
        const email = readString(value, "Email", 254).toLowerCase();

        if (!EMAIL_PATTERN.test(email)) {
          throw new Error("Enter a valid email address");
        }

        result.email = email;
        break;
      }
    }
  }

  return result;
}
