import "dotenv/config";

import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { Admin } from "../src/models/admin.model.js";
import { hashPassword } from "../src/utils/password.js";

const seedAdmin = async (): Promise<void> => {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env",
    );
  }

  if (password.length < 6) {
    throw new Error("Admin password must be at least 12 characters");
  }

  await connectDatabase();

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new Error("An admin with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  console.log("Admin account created successfully");
};

seedAdmin()
  .catch((error: unknown) => {
    console.error("Admin setup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
