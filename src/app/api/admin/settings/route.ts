import { NextResponse } from "next/server";
import { z } from "zod";

import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/SiteConfig";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

const siteConfigSchema = z.object({
  heroTitle: z.string().min(1),
  heroHighlight: z.string().min(1),
  heroSubtext: z.string().min(1),
  heroDate: z.string().min(1),
  heroTime: z.string().min(1),
  heroPrice: z.coerce.number().min(1),
  heroOriginalPrice: z.coerce.number().min(1),
  heroSeminarId: z.string().optional().or(z.literal("")),
  announcementText: z.string().min(1),
  showAnnouncement: z.boolean(),
});

export async function GET() {
  await connectDB();
  const config = await SiteConfig.findOne().sort({ createdAt: -1 }).lean();
  return NextResponse.json(config ? serialize(config) : null);
}

export async function PUT(request: Request) {
  await connectDB();
  const body = await request.json();
  const validated = siteConfigSchema.parse(body);

  const existing = await SiteConfig.findOne();
  const saved = existing
    ? await SiteConfig.findByIdAndUpdate(existing._id, validated, { returnDocument: "after" }).lean()
    : await SiteConfig.create(validated);

  return NextResponse.json(serialize(saved));
}
