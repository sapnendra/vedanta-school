import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  registrationId?: string;
  registrationDraft?: {
    seminarId: string;
    seminarTitle: string;
    name: string;
    email: string;
    phone: string;
    occupation: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: VerifyPaymentBody = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      registrationDraft,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing required payment verification fields" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    let isSignatureValid = false;
    try {
      isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
      );
    } catch {
      isSignatureValid = false;
    }

    if (!isSignatureValid) {
      console.error("[VERIFY] Invalid signature for registrationId:", registrationId);
      if (registrationId) {
        await Registration.findByIdAndUpdate(registrationId, {
          paymentStatus: "failed",
          paymentId: razorpay_payment_id,
        });
      }
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    if (registrationId) {
      // Move to captured only once and increment seats only on first capture.
      const updated = await Registration.findOneAndUpdate(
        { _id: registrationId, paymentStatus: { $ne: "captured" } },
        {
          paymentStatus: "captured",
          paymentId: razorpay_payment_id,
        },
        { returnDocument: "after" }
      ).lean();

      if (updated) {
        await Seminar.findByIdAndUpdate(updated.seminarId, { $inc: { seatsFilled: 1 } });
      } else {
        const existing = await Registration.findById(registrationId).lean();
        if (!existing) {
          return NextResponse.json(
            { error: "Registration not found during update" },
            { status: 404 }
          );
        }
      }

      console.log("[VERIFY] Payment verified successfully:", razorpay_payment_id);

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    }

    const existingByPaymentId = await Registration.findOne({ paymentId: razorpay_payment_id }).lean();
    if (existingByPaymentId) {
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        paymentId: razorpay_payment_id,
      });
    }

    const seminarId = registrationDraft?.seminarId?.trim();
    const seminarTitle = registrationDraft?.seminarTitle?.trim();
    const name = registrationDraft?.name?.trim();
    const email = registrationDraft?.email?.trim();
    const phone = registrationDraft?.phone?.trim();
    const occupation = registrationDraft?.occupation?.trim();

    if (!seminarId || !seminarTitle || !name || !email || !phone || !occupation) {
      return NextResponse.json(
        { error: "Missing registration context for payment verification" },
        { status: 400 }
      );
    }

    const seminar = await Seminar.findById(seminarId);
    if (!seminar || !seminar.isActive) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 });
    }

    if (seminar.seatsFilled >= seminar.seatsTotal) {
      return NextResponse.json(
        {
          error:
            "Payment verified but seminar seats are now full. Please contact support for manual resolution/refund.",
        },
        { status: 409 }
      );
    }

    const registration = await Registration.create({
      name,
      email,
      phone,
      occupation,
      seminarId,
      seminarTitle,
      paymentStatus: "captured",
      paymentId: razorpay_payment_id,
    });

    await Seminar.findByIdAndUpdate(seminarId, { $inc: { seatsFilled: 1 } });

    console.log("[VERIFY] Payment verified successfully:", razorpay_payment_id);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      registrationId: registration._id.toString(),
    });
  } catch (error: unknown) {
    console.error("[VERIFY ERROR]", error);
    return NextResponse.json(
      { error: "Payment verification failed. Contact support." },
      { status: 500 }
    );
  }
}
