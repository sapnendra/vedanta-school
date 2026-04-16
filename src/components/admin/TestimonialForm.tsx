"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations/testimonial";

/* eslint-disable @next/next/no-img-element */

type TestimonialFormProps = {
  testimonial?: TestimonialInput & { _id?: string };
  mode: "create" | "edit";
};

type TestimonialFormValues = z.input<typeof testimonialSchema>;

export default function TestimonialForm({ testimonial, mode }: TestimonialFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState(testimonial?.imageUrl ?? "");
  const [rating, setRating] = useState<number>(testimonial?.rating ?? 5);

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial ?? {
      name: "",
      role: "",
      content: "",
      rating: 5,
      imageUrl: "",
      isActive: true,
    },
  });

  const isActive = useWatch({ control: form.control, name: "isActive" });
  const contentValue = useWatch({ control: form.control, name: "content" }) ?? "";

  const selectRating = (value: number): void => {
    setRating(value);
    form.setValue("rating", value, { shouldValidate: true });
  };

  const onSubmit = async (values: TestimonialFormValues): Promise<void> => {
    try {
      const parsedValues = testimonialSchema.parse({ ...values, rating });
      const endpoint = mode === "create" ? "/api/admin/testimonials" : `/api/admin/testimonials/${testimonial?._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedValues),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error(body.error ?? "Failed to save testimonial");
        return;
      }

      toast.success(mode === "create" ? "Testimonial created" : "Testimonial updated");
      router.push("/admin/testimonials");
    } catch {
      toast.error("Please check the form and try again");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="Student / Working Professional" {...form.register("role")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" rows={4} maxLength={300} {...form.register("content")} />
            <p className="text-right text-xs text-white/55">{contentValue.length}/300</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...form.register("imageUrl")}
              onChange={(event) => {
                form.register("imageUrl").onChange(event);
                setPreviewUrl(event.target.value);
              }}
            />
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-saffron/20 bg-black/20 p-4">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-saffron/30 bg-charcoal/70">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-white/50">N/A</div>
              )}
            </div>
            <p className="text-sm text-white/60">Avatar preview</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1 rounded-lg border border-saffron/20 p-3">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const filled = starValue <= rating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => selectRating(starValue)}
                    className="rounded p-1 transition hover:bg-white/5"
                    aria-label={`Set rating to ${starValue}`}
                  >
                    <Star
                      className={filled ? "h-6 w-6 text-yellow-400" : "h-6 w-6 text-white/35"}
                      fill={filled ? "currentColor" : "none"}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-saffron/20 px-3 py-2">
            <Label htmlFor="isActive">Is Active</Label>
            <Switch id="isActive" checked={Boolean(isActive)} onCheckedChange={(checked) => form.setValue("isActive", checked)} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <Button type="submit" className="bg-saffron text-charcoal hover:bg-gold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Testimonial"}
        </Button>
      </div>
    </form>
  );
}
