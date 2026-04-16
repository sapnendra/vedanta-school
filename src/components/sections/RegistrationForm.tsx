"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { useRazorpay } from "@/hooks/useRazorpay";
import { fetchSeminars } from "@/lib/api";
import type { RegistrationInput } from "@/lib/validations/registration";

const occupationOptions = [
  "Student",
  "Working Professional",
  "Business Owner",
  "Other",
] as const;

type SeminarOption = {
  _id: string;
  title: string;
  date: string;
  price: number;
};

const formSchema = z.object({
  name: z.string().min(2, "Please enter at least 2 characters."),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit WhatsApp number."),
  email: z.string().email("Please enter a valid email address."),
  seminarId: z.string().min(1, "Please select a seminar."),
  occupation: z.enum(occupationOptions),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [seminars, setSeminars] = useState<SeminarOption[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openPaymentModal } = useRazorpay();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      seminarId: "",
      occupation: "Student",
    },
  });

  const selectedSeminarId = useWatch({
    control: form.control,
    name: "seminarId",
  });
  const selectedSeminar = seminars.find(
    (seminar) => seminar._id === selectedSeminarId,
  );
  const payableAmount = selectedSeminar?.price ?? 99;

  useEffect(() => {
    let mounted = true;

    const loadSeminars = async () => {
      try {
        const data = await fetchSeminars();
        if (mounted) {
          setSeminars(data as SeminarOption[]);
          const savedId = sessionStorage.getItem("selectedSeminarId");
          if (savedId) {
            form.setValue("seminarId", savedId);
            sessionStorage.removeItem("selectedSeminarId");
          }
        }
      } catch {
        // Keep form usable even if seminar list fails once.
      }
    };

    loadSeminars();

    return () => {
      mounted = false;
    };
  }, [form]);

  const handleSuccessClose = () => {
    form.reset();
    setShowSuccess(false);
  };

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true);

    try {
      const selected = seminars.find((seminar) => seminar._id === data.seminarId);
      if (!selected) {
        toast.error("Please select a valid seminar.");
        return;
      }

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const orderData = (await orderRes.json()) as {
        error?: string;
        keyId: string;
        amount: number;
        currency: string;
        orderId: string;
        prefill: { name: string; email: string; contact: string };
        notes?: Record<string, string>;
      };

      if (!orderRes.ok) {
        toast.error(orderData.error || "Could not initiate payment. Please try again.");
        return;
      }

      await openPaymentModal({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vedanta Life School",
        description: `Seminar: ${orderData.notes?.seminarTitle || "Bhagavad Gita Seminar"}`,
        order_id: orderData.orderId,
        prefill: orderData.prefill,
        notes: orderData.notes,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
          emi: true,
        },
        config: {
          display: {
            sequence: ["block.upi", "block.card", "block.netbanking", "block.wallet", "block.paylater"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        theme: {
          color: "#FF6B1A",
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationDraft: {
                  seminarId: data.seminarId,
                  seminarTitle: selected.title,
                  name: data.name,
                  email: data.email,
                  phone: data.phone,
                  occupation: data.occupation,
                },
              }),
            });

            const verifyData = (await verifyRes.json()) as { error?: string };

            if (!verifyRes.ok) {
              toast.error(
                "Payment verification failed. Contact support with your payment ID: " +
                  response.razorpay_payment_id
              );
              return;
            }

            form.reset();
            setShowSuccess(true);
            console.log("[Payment] Success:", response.razorpay_payment_id);
          } catch (verifyError) {
            console.error("[Verify Error]", verifyError);
            toast.warning(
              "Payment received but verification pending. You will receive a confirmation shortly. Payment ID: " +
                response.razorpay_payment_id
            );
            setShowSuccess(true);
          }
        },
      });

    } catch (error: unknown) {
      if (error instanceof Error && error.message === "PAYMENT_CANCELLED") {
        toast.info("Payment cancelled. Your registration is saved. You can complete payment anytime.");
        return;
      }
      console.error("[Submit Error]", error);
      toast.error("Something went wrong. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const trustSignals = [
    "Secure Payment via Razorpay",
    "Instant WhatsApp Group Access",
    "100% Practical Session",
  ];

  return (
    <section
      id="register"
      className="relative overflow-hidden bg-charcoal px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,oklch(0.68_0.19_42/0.22)_0%,transparent_58%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">
            JOIN US
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            We Are Happy to Guide You
          </h2>
          <p className="mt-4 max-w-xl font-body text-lg text-muted-warm">
            Take the first step. The Gita will take care of the rest.
          </p>

          <ul className="mt-8 space-y-3">
            {trustSignals.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 font-body text-base text-ivory/90"
              >
                <CheckCircle2 className="size-5 text-saffron" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="pulse-alert mt-8 inline-flex items-center gap-2 rounded-full border border-saffron/35 bg-saffron/10 px-4 py-2 font-body text-sm font-semibold text-saffron">
            <Zap className="size-4" />
            <span>Only 13 seats remaining. Filling fast.</span>
          </p>
        </div>

        <Card className="border-gold/35 bg-white/5 shadow-[0_0_40px_oklch(0.72_0.14_75/0.16)] backdrop-blur-md">
          <CardContent className="p-6 sm:p-8">
            <h3 className="font-heading text-3xl font-bold text-ivory">
              Reserve Your Seat Now
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
                          <Input
                            placeholder="Enter your full name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
                          <Input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="10-digit WhatsApp number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seminarId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Seminar</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-warm" />
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Choose your seminar" />
                            </SelectTrigger>
                            <SelectContent>
                              {seminars.map((seminar) => (
                                <SelectItem
                                  key={seminar._id}
                                  value={seminar._id}
                                >
                                  {seminar.title} - {seminar.date}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            {occupationOptions.map((occupation) => (
                              <SelectItem key={occupation} value={occupation}>
                                {occupation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-saffron text-white hover:bg-saffron/90 h-14 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock size={18} />
                      Pay ₹{payableAmount} & Reserve Your Seat
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-white/40 mt-3">
                  🔒 Secured by Razorpay · UPI · Cards · Netbanking
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader className="items-center">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <DialogTitle className="font-heading text-2xl">
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="[font-family:var(--font-poppins)]">
              You&apos;ll receive WhatsApp group link within 24 hours
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">
            Check your WhatsApp for confirmation
          </p>
          <p className="text-xs text-white/40 mt-2">
            Payment confirmed ✓ · WhatsApp group link will be sent within 24 hours
          </p>
          <Button
            onClick={handleSuccessClose}
            className="w-full mt-6 bg-saffron text-charcoal hover:bg-gold"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Toaster richColors position="top-right" />
    </section>
  );
}
