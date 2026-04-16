import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { testimonialSchema } from "@/lib/validations/testimonial";
import Testimonial from "@/models/Testimonial";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(serialize(testimonials));
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const validatedData = testimonialSchema.parse(body);
  const testimonial = await Testimonial.create(validatedData);
  return NextResponse.json(serialize(testimonial), { status: 201 });
}
