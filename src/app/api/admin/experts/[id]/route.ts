import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { expertSchema } from "@/lib/validations/expert";
import Expert from "@/models/Expert";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const expert = await Expert.findById(id).lean();

  if (!expert) {
    return NextResponse.json({ error: "Expert not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(expert));
}

export async function PUT(request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const validatedData = expertSchema.parse(body);

  const expert = await Expert.findByIdAndUpdate(id, validatedData, { new: true }).lean();

  if (!expert) {
    return NextResponse.json({ error: "Expert not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(expert));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  await connectDB();
  const { id } = await params;
  await Expert.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
