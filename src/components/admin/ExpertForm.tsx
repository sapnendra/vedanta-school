"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { expertSchema, type ExpertInput } from "@/lib/validations/expert";

/* eslint-disable @next/next/no-img-element */

type ExpertFormProps = {
  expert?: ExpertInput & { _id?: string };
  mode: "create" | "edit";
};

type ExpertFormValues = z.input<typeof expertSchema>;

export default function ExpertForm({ expert, mode }: ExpertFormProps) {
  const router = useRouter();
  const [credentialInput, setCredentialInput] = useState("");
  const [credentials, setCredentials] = useState<string[]>(expert?.credentials ?? []);
  const [previewUrl, setPreviewUrl] = useState(expert?.imageUrl ?? "");

  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertSchema),
    defaultValues: expert ?? {
      name: "",
      title: "",
      bio: "",
      imageUrl: "",
      credentials: [],
      yearsMonk: 0,
      livesHelped: 0,
      seminars: 0,
      isActive: true,
    },
  });

  const isActive = useWatch({ control: form.control, name: "isActive" });

  useEffect(() => {
    form.setValue("credentials", credentials, { shouldValidate: true });
  }, [credentials, form]);

  const addCredential = (): void => {
    const value = credentialInput.trim();
    if (!value) return;
    setCredentials((prev) => [...prev, value]);
    setCredentialInput("");
  };

  const removeCredential = (value: string): void => {
    setCredentials((prev) => prev.filter((credential) => credential !== value));
  };

  const onSubmit = async (values: ExpertFormValues): Promise<void> => {
    try {
      const parsedValues = expertSchema.parse({ ...values, credentials });
      const endpoint = mode === "create" ? "/api/admin/experts" : `/api/admin/experts/${expert?._id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedValues),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error(body.error ?? "Failed to save expert");
        return;
      }

      toast.success(mode === "create" ? "Expert created" : "Expert updated");
      router.push("/admin/experts");
    } catch {
      toast.error("Please check the form and try again");
    }
  };

  const credentialsError = form.formState.errors.credentials?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register("name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title / Role</Label>
            <Input id="title" placeholder="Monk, Corporate Trainer & Life Coach" {...form.register("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={6} {...form.register("bio")} />
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
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-saffron/30 bg-charcoal/70">
              {previewUrl ? (
                <img src={previewUrl} alt="Expert preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-white/50">Preview</div>
              )}
            </div>
            <p className="text-sm text-white/60">Live preview</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Credentials</Label>
            <div className="flex gap-2">
              <Input
                value={credentialInput}
                onChange={(event) => setCredentialInput(event.target.value)}
                placeholder="Add credential"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCredential();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addCredential} className="border-saffron/40 text-saffron">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="flex min-h-10 flex-wrap gap-2 rounded-lg border border-saffron/20 p-2">
              {credentials.length === 0 ? (
                <span className="text-xs text-white/50">No credentials added</span>
              ) : (
                credentials.map((credential) => (
                  <Badge key={credential} className="bg-saffron/10 text-saffron border-saffron/20">
                    {credential}
                    <button
                      type="button"
                      onClick={() => removeCredential(credential)}
                      className="ml-1 text-saffron/70 hover:text-saffron"
                      aria-label={`Remove ${credential}`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            {credentialsError ? <p className="text-xs text-red-300">{credentialsError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsMonk">Years as Monk</Label>
            <Input id="yearsMonk" type="number" {...form.register("yearsMonk", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="livesHelped">Lives Helped</Label>
            <Input id="livesHelped" type="number" {...form.register("livesHelped", { valueAsNumber: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seminars">Seminars Conducted</Label>
            <Input id="seminars" type="number" {...form.register("seminars", { valueAsNumber: true })} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-saffron/20 px-3 py-2">
            <Label htmlFor="isActive">Is Active</Label>
            <Switch id="isActive" checked={Boolean(isActive)} onCheckedChange={(checked) => form.setValue("isActive", checked)} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button asChild variant="ghost">
          <Link href="/admin/experts">Cancel</Link>
        </Button>
        <Button type="submit" className="bg-saffron text-charcoal hover:bg-gold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Expert"}
        </Button>
      </div>
    </form>
  );
}
