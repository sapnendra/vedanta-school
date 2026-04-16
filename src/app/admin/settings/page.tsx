"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const settingsSchema = z.object({
  heroTitle: z.string().min(1),
  heroHighlight: z.string().min(1),
  heroSubtext: z.string().min(1),
  heroDate: z.string().min(1),
  heroTime: z.string().min(1),
  heroPrice: z.coerce.number().min(1),
  heroOriginalPrice: z.coerce.number().min(1),
  announcementText: z.string().min(1),
  showAnnouncement: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;
type SettingsFormValues = z.input<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      heroTitle: "",
      heroHighlight: "",
      heroSubtext: "",
      heroDate: "",
      heroTime: "",
      heroPrice: 99,
      heroOriginalPrice: 999,
      announcementText: "",
      showAnnouncement: true,
    },
  });

  const showAnnouncement = useWatch({ control: form.control, name: "showAnnouncement" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) return;
      const data = (await res.json()) as Partial<SettingsValues> | null;
      if (!data || !mounted) return;
      form.reset({
        heroTitle: data.heroTitle ?? "",
        heroHighlight: data.heroHighlight ?? "",
        heroSubtext: data.heroSubtext ?? "",
        heroDate: data.heroDate ?? "",
        heroTime: data.heroTime ?? "",
        heroPrice: data.heroPrice ?? 199,
        heroOriginalPrice: data.heroOriginalPrice ?? 999,
        announcementText: data.announcementText ?? "",
        showAnnouncement: data.showAnnouncement ?? true,
      });
    };
    load();
    return () => {
      mounted = false;
    };
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    const parsedValues = settingsSchema.parse(values);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedValues),
    });

    if (!res.ok) {
      toast.error("Failed to update settings");
      return;
    }

    toast.success("Settings saved");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-white font-heading">Settings</h1>

      <Card className="border-saffron/10 bg-[#14110d]">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" {...form.register("heroTitle")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroHighlight">Hero Highlight</Label>
            <Input id="heroHighlight" {...form.register("heroHighlight")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtext">Hero Subtext</Label>
            <Textarea id="heroSubtext" rows={3} {...form.register("heroSubtext")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroDate">Hero Date</Label>
              <Input id="heroDate" {...form.register("heroDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroTime">Hero Time</Label>
              <Input id="heroTime" {...form.register("heroTime")} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroPrice">Hero Price</Label>
              <Input id="heroPrice" type="number" {...form.register("heroPrice", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroOriginalPrice">Hero Original Price</Label>
              <Input id="heroOriginalPrice" type="number" {...form.register("heroOriginalPrice", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="announcementText">Announcement Text</Label>
            <Input id="announcementText" {...form.register("announcementText")} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-saffron/20 p-3">
            <Label htmlFor="showAnnouncement">Show Announcement</Label>
            <Switch
              id="showAnnouncement"
              checked={Boolean(showAnnouncement)}
              onCheckedChange={(checked) => form.setValue("showAnnouncement", checked)}
            />
          </div>
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-saffron text-charcoal hover:bg-gold">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
