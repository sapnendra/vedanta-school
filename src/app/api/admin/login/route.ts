import { NextResponse } from "next/server";

import { comparePassword, signToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Admin, { type IAdmin } from "@/models/Admin";

type LoginBody = {
  email: string;
  password: string;
};

type LeanAdmin = Pick<IAdmin, "email" | "password"> & {
  _id: { toString: () => string };
};

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginBody;

  await connectDB();

  const admin = (await Admin.findOne({ email }).lean()) as LeanAdmin | null;

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValidPassword = await comparePassword(password, admin.password);

  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({
    adminId: admin._id.toString(),
    email: admin.email,
    role: "admin",
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin-token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
