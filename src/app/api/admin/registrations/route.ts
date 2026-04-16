import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const seminarId = searchParams.get("seminarId");
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();
  const groupStatus = searchParams.get("groupStatus");

  const query: {
    seminarId?: string;
    paymentStatus?: string;
    addedToGroup?: boolean;
    $or?: Array<{ name?: RegExp; email?: RegExp; phone?: RegExp; seminarTitle?: RegExp }>;
  } = {};

  if (seminarId) {
    query.seminarId = seminarId;
  }

  if (status) {
    query.paymentStatus = status;
  }

  if (groupStatus === "added") {
    query.addedToGroup = true;
  }

  if (groupStatus === "not-added") {
    query.addedToGroup = false;
  }

  if (search) {
    const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { name: pattern },
      { email: pattern },
      { phone: pattern },
      { seminarTitle: pattern },
    ];
  }

  const registrations = await Registration.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json(serialize(registrations));
}
