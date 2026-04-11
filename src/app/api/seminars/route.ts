import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Seminar from "@/models/Seminar";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const seminars = await Seminar.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  return NextResponse.json(serialize(seminars));
}
