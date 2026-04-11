import { z } from "zod";

export const seminarSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10),
  badge: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  seatsTotal: z.coerce.number().min(1).max(500),
  seatsFilled: z.coerce.number().min(0),
  price: z.coerce.number().min(1),
  originalPrice: z.coerce.number().min(1),
  imageUrl: z.string().url("Must be a valid URL"),
  isActive: z.boolean(),
});

export type SeminarInput = z.infer<typeof seminarSchema>;
