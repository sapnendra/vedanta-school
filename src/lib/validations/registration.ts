import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number"),
  occupation: z.enum(["Student", "Working Professional", "Business Owner", "Other"]),
  seminarId: z.string().min(1, "Please select a seminar"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
