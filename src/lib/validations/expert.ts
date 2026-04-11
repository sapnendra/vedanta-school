import { z } from "zod";

export const expertSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(5),
  bio: z.string().min(20),
  imageUrl: z.string().url(),
  credentials: z.array(z.string().min(1)).min(1, "Add at least one credential"),
  yearsMonk: z.coerce.number().min(0),
  livesHelped: z.coerce.number().min(0),
  seminars: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export type ExpertInput = z.infer<typeof expertSchema>;
