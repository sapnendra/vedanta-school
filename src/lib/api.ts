import type {
  IExpertData,
  ISeminarData,
  ISiteConfigData,
  ITestimonialData,
} from "@/types";

export async function fetchSeminars(): Promise<ISeminarData[]> {
  try {
    const res = await fetch("/api/seminars", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchExperts(): Promise<IExpertData[]> {
  try {
    const res = await fetch("/api/experts", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchTestimonials(): Promise<ITestimonialData[]> {
  try {
    const res = await fetch("/api/testimonials", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchConfig(): Promise<ISiteConfigData | null> {
  try {
    const res = await fetch("/api/config", { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
