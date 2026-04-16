import "server-only";

import Razorpay from "razorpay";

function normalizeEnv(value?: string): string {
  const trimmed = (value ?? "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

const serverKeyId = normalizeEnv(process.env.RAZORPAY_KEY_ID) || normalizeEnv(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
const serverKeySecret = normalizeEnv(process.env.RAZORPAY_KEY_SECRET);

export function getRazorpayConfigError(): string | null {
  if (!serverKeySecret) {
    return "RAZORPAY_KEY_SECRET is not defined in environment variables";
  }

  if (serverKeySecret.includes("your_razorpay_secret")) {
    return "RAZORPAY_KEY_SECRET is a placeholder. Set your real Razorpay secret key.";
  }

  if (!/^[A-Za-z0-9_]+$/.test(serverKeySecret) || serverKeySecret.endsWith("=")) {
    return "RAZORPAY_KEY_SECRET format looks invalid. Use Razorpay API Key Secret (from API Keys), not webhook secret or encoded token.";
  }

  if (!serverKeyId) {
    return "RAZORPAY_KEY_ID/NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined in environment variables";
  }

  return null;
}

const razorpay = new Razorpay({
  key_id: serverKeyId || "",
  key_secret: serverKeySecret || "",
});

export default razorpay;
export const razorpayPublicKeyId = serverKeyId;


/*
  ╔══════════════════════════════════════════════════════════════╗
  ║           RAZORPAY TEST CREDENTIALS                         ║
  ║  Use these ONLY in test mode (rzp_test_... key)            ║
  ╠══════════════════════════════════════════════════════════════╣
  ║  UPI (success):     success@razorpay                        ║
  ║  UPI (failure):     failure@razorpay                        ║
  ║                                                              ║
  ║  Test Card (success):                                        ║
  ║    Number:  4111 1111 1111 1111                             ║
  ║    Expiry:  Any future date                                  ║
  ║    CVV:     Any 3 digits                                     ║
  ║    OTP:     1234 (or any 4 digits)                           ║
  ║                                                              ║
  ║  Test Card (failure):                                        ║
  ║    Number:  4000 0000 0000 0002                             ║
  ║                                                              ║
  ║  Netbanking: Select any bank → Use test credentials shown   ║
  ║                                                              ║
  ║  WEBHOOK TESTING:                                            ║
  ║    Local: Use ngrok → ngrok http 3000                       ║
  ║    Dashboard: Settings → Webhooks → Add URL                 ║
  ║    URL: https://YOUR_NGROK_URL/api/payment/webhook          ║
  ║    Events to subscribe:                                      ║
  ║      ✓ payment.captured                                      ║
  ║      ✓ payment.failed                                        ║
  ║      ✓ order.paid                                            ║
  ╚══════════════════════════════════════════════════════════════╝
*/