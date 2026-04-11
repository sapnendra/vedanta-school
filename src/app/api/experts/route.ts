import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Expert from "@/models/Expert";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const experts = await Expert.find({ isActive: true }).sort({ createdAt: 1 }).lean();
  return NextResponse.json(serialize(experts));
}
