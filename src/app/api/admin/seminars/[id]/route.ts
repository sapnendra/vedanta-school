import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { seminarSchema } from "@/lib/validations/seminar";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await connectDB();

  const { id } = await params;
  const seminar = await Seminar.findById(id).lean();

  if (!seminar) {
    return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(seminar));
}

export async function PUT(request: Request, { params }: RouteContext) {
  await connectDB();

  const { id } = await params;
  const body = await request.json();
  const validatedData = seminarSchema.parse(body);

  const updated = await Seminar.findByIdAndUpdate(id, validatedData, { new: true }).lean();

  if (!updated) {
    return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
  }

  return NextResponse.json(serialize(updated));
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  await connectDB();

  const { id } = await params;
  const hasRegistrations = await Registration.exists({ seminarId: id });

  if (hasRegistrations) {
    return NextResponse.json({ error: "Cannot delete seminar with existing registrations" }, { status: 400 });
  }

  await Seminar.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
