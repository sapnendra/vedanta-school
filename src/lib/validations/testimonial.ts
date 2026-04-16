import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  content: z.string().min(10).max(300),
  rating: z.coerce.number().min(1).max(5),
  imageUrl: z.string().url(),
  isActive: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
