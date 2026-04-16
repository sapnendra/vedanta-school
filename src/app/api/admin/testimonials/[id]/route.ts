import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { testimonialSchema } from "@/lib/validations/testimonial";
import Testimonial from "@/models/Testimonial";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const testimonial = await Testimonial.findById(id).lean();

  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(testimonial));
}

export async function PUT(request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const validatedData = testimonialSchema.parse(body);

  const testimonial = await Testimonial.findByIdAndUpdate(id, validatedData, { returnDocument: "after" }).lean();

  if (!testimonial) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(testimonial));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  await Testimonial.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
