import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { expertSchema } from "@/lib/validations/expert";
import Expert from "@/models/Expert";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const experts = await Expert.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(serialize(experts));
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const validatedData = expertSchema.parse(body);
  const expert = await Expert.create(validatedData);
  return NextResponse.json(serialize(expert), { status: 201 });
}
