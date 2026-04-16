import { NextRequest, NextResponse } from "next/server";

import razorpay, { getRazorpayConfigError, razorpayPublicKeyId } from "@/lib/razorpay";
import { connectDB } from "@/lib/mongodb";
import { registrationSchema } from "@/lib/validations/registration";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";

export async function POST(req: NextRequest) {
  try {
    const configError = getRazorpayConfigError();
    if (configError) {
      return NextResponse.json(
        {
          error:
            "Payment gateway is misconfigured: " +
            configError +
            " Fix .env.local and restart server.",
        },
        { status: 500 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { registrationId } = body as { registrationId?: string };

    if (registrationId && typeof registrationId === "string") {
      const registration = await Registration.findById(registrationId).lean();

      if (!registration) {
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 }
        );
      }

      if (registration.paymentStatus === "captured") {
        return NextResponse.json(
          { error: "Payment already completed for this registration" },
          { status: 409 }
        );
      }

      const seminar = await Seminar.findById(registration.seminarId).lean();

      if (!seminar) {
        return NextResponse.json(
          { error: "Seminar not found" },
          { status: 404 }
        );
      }

      const amountInPaise = seminar.price * 100;

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `reg_${registrationId}`,
        notes: {
          registrationId,
          seminarId: registration.seminarId.toString(),
          seminarTitle: registration.seminarTitle,
          userName: registration.name,
          userEmail: registration.email,
          userPhone: registration.phone,
          occupation: registration.occupation,
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: razorpayPublicKeyId,
        prefill: {
          name: registration.name,
          email: registration.email,
          contact: registration.phone,
        },
        notes: {
          seminarTitle: registration.seminarTitle,
        },
      });
    }

    const validatedInput = registrationSchema.parse(body);

    const seminar = await Seminar.findById(validatedInput.seminarId).lean();
    if (!seminar || !seminar.isActive) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 400 });
    }

    if (seminar.seatsFilled >= seminar.seatsTotal) {
      return NextResponse.json({ error: "Seats are full for this seminar" }, { status: 400 });
    }

    const amountInPaise = seminar.price * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `draft_${Date.now()}`,
      notes: {
        seminarId: seminar._id.toString(),
        seminarTitle: seminar.title,
        userName: validatedInput.name,
        userEmail: validatedInput.email,
        userPhone: validatedInput.phone,
        occupation: validatedInput.occupation,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: razorpayPublicKeyId,
      prefill: {
        name: validatedInput.name,
        email: validatedInput.email,
        contact: validatedInput.phone,
      },
      notes: {
        seminarTitle: seminar.title,
      },
    });
  } catch (error: unknown) {
    console.error("[CREATE ORDER ERROR]", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      (error as { statusCode?: number }).statusCode === 401
    ) {
      return NextResponse.json(
        {
          error:
            "Razorpay authentication failed. Verify your key-secret pair in .env.local (same account and same mode), remove any quotes/spaces, then restart the dev server.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create payment order. Please try again." },
      { status: 500 }
    );
  }
}
