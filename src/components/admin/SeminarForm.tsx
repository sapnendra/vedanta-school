"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { type SeminarInput, seminarSchema } from "@/lib/validations/seminar";

/* eslint-disable @next/next/no-img-element */

type SeminarFormProps = {
  seminar?: SeminarInput & { _id?: string };
  mode: "create" | "edit";
};

type SeminarFormValues = z.input<typeof seminarSchema>;

export default function SeminarForm({ seminar, mode }: SeminarFormProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string>(seminar?.imageUrl ?? "");

  const form = useForm<SeminarFormValues>({
    resolver: zodResolver(seminarSchema),
    defaultValues: seminar ?? {
      title: "",
      description: "",
      badge: "",
      date: "",
      time: "",
      seatsTotal: 100,
      seatsFilled: 0,
      price: 199,
      originalPrice: 999,
      imageUrl: "",
      isActive: true,
    },
  });

  const isActive = useWatch({
    control: form.control,
    name: "isActive",
  });

  const onSubmit = async (values: SeminarFormValues): Promise<void> => {
    try {
      const parsedValues = seminarSchema.parse(values);
      const endpoint = mode === "create" ? "/api/admin/seminars" : `/api/admin/seminars/${seminar?._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedValues),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error(body.error ?? "Failed to save seminar");
        return;
      }

      toast.success(mode === "create" ? "Seminar created" : "Seminar updated");
      router.push("/admin/seminars");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge">Badge</Label>
            <Input id="badge" placeholder="Leadership / Management / Decision Making" {...form.register("badge")} />
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

          <div className="aspect-video overflow-hidden rounded-xl border border-saffron/20 bg-black/20">
            {previewUrl ? (
              <img src={previewUrl} alt="Seminar preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/50">Image preview</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...form.register("date")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" placeholder="7:00 PM - 9:00 PM IST" {...form.register("time")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ₹</Label>
            <Input id="price" type="number" {...form.register("price", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalPrice">Original Price ₹</Label>
            <Input id="originalPrice" type="number" {...form.register("originalPrice", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatsTotal">Seats Total</Label>
            <Input id="seatsTotal" type="number" {...form.register("seatsTotal", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatsFilled">Seats Filled</Label>
            <Input id="seatsFilled" type="number" {...form.register("seatsFilled", { valueAsNumber: true })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-saffron/20 px-3 py-2">
            <Label htmlFor="isActive">Is Active</Label>
            <Switch
              id="isActive"
              checked={Boolean(isActive)}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/seminars">Cancel</Link>
        </Button>
        <Button type="submit" className="bg-saffron text-charcoal hover:bg-gold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Seminar"}
        </Button>
      </div>
    </form>
  );
}
