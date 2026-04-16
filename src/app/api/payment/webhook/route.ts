import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";
import WebhookEvent from "@/models/WebhookEvent";

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.alloc(0);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const rawBody = await getRawBody(req);

    const razorpaySignature = req.headers.get("x-razorpay-signature");
    const eventId = req.headers.get("x-razorpay-event-id");

    if (!razorpaySignature) {
      console.error("[WEBHOOK] Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[WEBHOOK] RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Server config error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpaySignature, "hex")
      );
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.error("[WEBHOOK] Signature verification FAILED - possible spoofing attempt");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const event = payload.event as string;

    console.log("[WEBHOOK] Received verified event:", event, "| eventId:", eventId);

    if (eventId) {
      const alreadyProcessed = await WebhookEvent.findOne({ eventId }).lean();
      if (alreadyProcessed) {
        console.log("[WEBHOOK] Duplicate event, skipping:", eventId);
        return NextResponse.json({ received: true, duplicate: true });
      }

      await WebhookEvent.create({
        eventId,
        event,
        processedAt: new Date(),
      });
    }

    switch (event) {
      case "payment.captured": {
        const payment = payload.payload?.payment?.entity;
        if (!payment) break;

        const orderId = payment.order_id as string;
        const paymentId = payment.id as string;
        const receipt = (payment.description as string) || "";
        const registrationId =
          (payment.notes?.registrationId as string | undefined) ||
          (orderId ? receipt.replace("reg_", "") : null);

        if (registrationId) {
          const updated = await Registration.findOneAndUpdate(
            { _id: registrationId, paymentStatus: { $ne: "captured" } },
            {
              paymentStatus: "captured",
              paymentId,
            },
            { returnDocument: "after" }
          ).lean();

          if (updated) {
            await Seminar.findByIdAndUpdate(updated.seminarId, { $inc: { seatsFilled: 1 } });
          }
          console.log("[WEBHOOK] payment.captured - registrationId:", registrationId);
        } else {
          console.warn("[WEBHOOK] payment.captured - could not extract registrationId from notes");
        }
        break;
      }

      case "payment.failed": {
        const payment = payload.payload?.payment?.entity;
        if (!payment) break;

        const registrationId = payment.notes?.registrationId as string | undefined;
        if (registrationId) {
          await Registration.findByIdAndUpdate(registrationId, {
            paymentStatus: "failed",
            paymentId: payment.id,
          });
          console.log("[WEBHOOK] payment.failed - registrationId:", registrationId);
        }
        break;
      }

      case "order.paid": {
        const order = payload.payload?.order?.entity;
        const payment = payload.payload?.payment?.entity;
        if (!order || !payment) break;

        const registrationId = order.notes?.registrationId as string | undefined;
        if (registrationId) {
          const updated = await Registration.findOneAndUpdate(
            { _id: registrationId, paymentStatus: { $ne: "captured" } },
            {
              paymentStatus: "captured",
              paymentId: payment.id,
            },
            { returnDocument: "after" }
          ).lean();

          if (updated) {
            await Seminar.findByIdAndUpdate(updated.seminarId, { $inc: { seatsFilled: 1 } });
          }
          console.log("[WEBHOOK] order.paid - registrationId:", registrationId);
        }
        break;
      }

      default:
        console.log("[WEBHOOK] Unhandled event type:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("[WEBHOOK ERROR]", error);
    return NextResponse.json({ received: true, error: "Internal processing error" });
  }
}
