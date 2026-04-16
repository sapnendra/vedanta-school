import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";

const updateRegistrationSchema = z
  .object({
    paymentStatus: z.enum(["pending", "captured", "failed"]).optional(),
    addedToGroup: z.boolean().optional(),
  })
  .refine((value) => value.paymentStatus !== undefined || value.addedToGroup !== undefined, {
    message: "At least one field is required",
  });

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  await connectDB();

  const { id } = await params;
  const body = await request.json();
  const validated = updateRegistrationSchema.parse(body);

  const updated = await Registration.findByIdAndUpdate(
    id,
    validated,
    { returnDocument: "after" }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(updated));
}
