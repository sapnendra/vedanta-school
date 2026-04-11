"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Flame, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      toast.error("Invalid email or password");
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#1f1f1f] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <Card className="w-full border-[#b99142] bg-[#252525] text-[#f5e9cf] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <CardHeader className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-7 w-7 text-[#d97706]" />
              <h1 className="text-2xl font-semibold text-[#d97706] font-heading">
                Vedanta Life School
              </h1>
            </div>
            <p className="text-sm text-[#c4b18a] [font-family:var(--font-poppins)]">Admin Panel</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-[#e6d9ba] [font-family:var(--font-poppins)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ad9a76]" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="border-[#8f7742] bg-[#1f1f1f] pl-10 text-[#f5e9cf] placeholder:text-[#8f7f5b]"
                    placeholder="admin@example.com"
                    {...form.register("email")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm text-[#e6d9ba] [font-family:var(--font-poppins)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ad9a76]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="border-[#8f7742] bg-[#1f1f1f] px-10 text-[#f5e9cf] placeholder:text-[#8f7f5b]"
                    placeholder="Enter password"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ad9a76] transition hover:text-[#f0d7a1]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-[#d97706] text-black hover:bg-[#ea8b13]"
              >
                {form.formState.isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login to Admin"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors position="top-right" />
    </main>
  );
}
