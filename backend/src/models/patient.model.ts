import mongoose, { Schema, type Document } from "mongoose";

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  condition: string;
  doctor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    condition: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

patientSchema.index({ createdAt: -1 });
patientSchema.index({ name: 1 });
patientSchema.index({ condition: 1 });
patientSchema.index({ doctor: 1, createdAt: -1 });

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
