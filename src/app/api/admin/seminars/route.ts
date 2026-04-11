import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { seminarSchema } from "@/lib/validations/seminar";
import Seminar from "@/models/Seminar";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const seminars = await Seminar.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(serialize(seminars));
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const validatedData = seminarSchema.parse(body);
  const seminar = await Seminar.create(validatedData);

  return NextResponse.json(serialize(seminar), { status: 201 });
}
