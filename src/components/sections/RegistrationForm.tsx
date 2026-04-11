"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, GraduationCap, Lock, Mail, Phone, Shield, User, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const seminarTitles = [
  "Leadership from Bhagavad Gita",
  "Management According to Scriptures",
  "Decision Making with Gita Wisdom",
  "Stress-Free Living - The Monk's Way",
  "Finding Your Dharma - Life Purpose Seminar",
] as const;

const occupationOptions = ["Student", "Working Professional", "Business Owner", "Other"] as const;

const formSchema = z.object({
  name: z.string().min(2, "Please enter at least 2 characters."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit WhatsApp number."),
  email: z.string().email("Please enter a valid email address."),
  seminar: z.string().min(1, "Please select a seminar."),
  occupation: z.string().min(1, "Please select your occupation."),
});

type FormValues = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      seminar: "",
      occupation: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Registration payload:", data);
    // TODO: Integrate Razorpay checkout flow and persist booking record.
  };

  const trustSignals = [
    "Secure Payment via Razorpay",
    "Instant WhatsApp Group Access",
    "100% Practical Session",
  ];

  return (
    <section id="register" className="relative overflow-hidden bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,oklch(0.68_0.19_42/0.22)_0%,transparent_58%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">JOIN US</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            We Are Happy to Guide You
          </h2>
          <p className="mt-4 max-w-xl font-body text-lg text-muted-warm">
            Take the first step. The Gita will take care of the rest.
          </p>

          <ul className="mt-8 space-y-3">
            {trustSignals.map((item) => (
              <li key={item} className="flex items-center gap-3 font-body text-base text-ivory/90">
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
            <h3 className="font-heading text-3xl font-bold text-ivory">Reserve Your Seat Now</h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-warm" />
                          <Input placeholder="Enter your full name" className="pl-10" {...field} />
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
                          <Input type="email" placeholder="you@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seminar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Seminar</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-warm" />
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Choose your seminar" />
                            </SelectTrigger>
                            <SelectContent>
                              {seminarTitles.map((seminar) => (
                                <SelectItem key={seminar} value={seminar}>
                                  {seminar}
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
                        <Select value={field.value} onValueChange={field.onChange}>
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

                <Button type="submit" className="mt-2 h-12 w-full rounded-full bg-saffron text-base font-semibold text-charcoal hover:bg-gold">
                  <Lock className="size-4" />
                  Pay ₹199 &amp; Reserve Seat →
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-warm">
                  <Shield className="size-3.5" />
                  <span>100% Secure • Powered by Razorpay</span>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
