import mongoose, { Schema, type Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 12,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
