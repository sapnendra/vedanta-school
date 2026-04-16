import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  return NextResponse.json(serialize(testimonials));
}
