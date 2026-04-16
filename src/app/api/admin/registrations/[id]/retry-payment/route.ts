import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import razorpay, { getRazorpayConfigError } from "@/lib/razorpay";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: RouteContext) {
  try {
    const configError = getRazorpayConfigError();
    if (configError) {
      return NextResponse.json(
        { error: "Payment gateway is misconfigured: " + configError },
        { status: 500 }
      );
    }

    await connectDB();

    const { id } = await params;

    const registration = await Registration.findById(id).lean();
    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.paymentStatus === "captured") {
      return NextResponse.json(
        { error: "Payment is already captured for this registration" },
        { status: 409 }
      );
    }

    const seminar = await Seminar.findById(registration.seminarId).lean();
    if (!seminar) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
    }

    const amountInPaise = seminar.price * 100;

    const paymentLink = await razorpay.paymentLink.create({
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: `Retry payment for ${registration.seminarTitle}`,
      customer: {
        name: registration.name,
        email: registration.email,
        contact: registration.phone,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        registrationId: registration._id.toString(),
        seminarTitle: registration.seminarTitle,
      },
      reference_id: `reg_retry_${registration._id.toString().slice(-20)}`,
      expire_by: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    });

    return NextResponse.json({
      success: true,
      shortUrl: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
    });
  } catch (error: unknown) {
    console.error("[ADMIN RETRY PAYMENT LINK ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create retry payment link" },
      { status: 500 }
    );
  }
}
