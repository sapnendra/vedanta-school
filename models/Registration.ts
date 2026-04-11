import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration extends Document {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  seminarId: mongoose.Types.ObjectId;
  seminarTitle: string;
  paymentId?: string;
  paymentStatus: "pending" | "captured" | "failed";
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    occupation: { type: String, required: true },
    seminarId: { type: Schema.Types.ObjectId, ref: "Seminar", required: true },
    seminarTitle: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "captured", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);
