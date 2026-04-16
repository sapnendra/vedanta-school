import { NextResponse } from "next/server";

import { registrationSchema } from "@/lib/validations/registration";

export async function POST(request: Request) {
  const body = await request.json();
  registrationSchema.parse(body);

  return NextResponse.json(
    {
      error: "Direct registration is disabled. Create payment order first and complete verification.",
    },
    { status: 410 }
  );
}
