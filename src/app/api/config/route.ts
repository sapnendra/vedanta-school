import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export async function GET() {
  await connectDB();
  const config = await SiteConfig.findOne().sort({ createdAt: -1 }).lean();
  if (!config) {
    return NextResponse.json(null);
  }
  return NextResponse.json(serialize(config));
}
