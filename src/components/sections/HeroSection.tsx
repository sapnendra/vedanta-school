"use client";

import Image from "next/image";
import { CalendarDays, Clock3, Flame, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchConfig, fetchSeminars } from "@/lib/api";
import type { ISeminarData, ISiteConfigData } from "@/types";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetDate: number): Countdown {
  const diff = Math.max(targetDate - Date.now(), 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function pickText(primary?: string | null, fallback?: string): string {
  const value = primary?.trim();
  return value ? value : (fallback ?? "");
}

export default function HeroSection() {
  const targetDateRef = useRef<number | null>(null);
  const [config, setConfig] = useState<ISiteConfigData | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [upcomingSeminar, setUpcomingSeminar] = useState<ISeminarData | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const fallbackTarget = () => Date.now() + 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000;

  useEffect(() => {
    const candidateDate = upcomingSeminar?.date ?? config?.heroDate;
    const parsed = candidateDate ? new Date(candidateDate).getTime() : Number.NaN;
    const target = Number.isFinite(parsed) ? Math.max(parsed, Date.now()) : fallbackTarget();

    targetDateRef.current = target;
    setCountdown(getTimeLeft(target));

    const interval = setInterval(() => {
      if (targetDateRef.current) {
        setCountdown(getTimeLeft(targetDateRef.current));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upcomingSeminar?.date, config?.heroDate]);

  useEffect(() => {
    let mounted = true;
    const loadConfig = async () => {
      const data = await fetchConfig();
      if (mounted) {
        setConfig(data);
        setConfigLoading(false);
      }
    };
    loadConfig();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSeminars = async () => {
      const seminars = await fetchSeminars();
      if (!mounted || seminars.length === 0) {
        return;
      }

      const now = Date.now();

      const activeSeminars = seminars.filter((seminar) => seminar.isActive !== false);

      const upcoming = activeSeminars
        .map((seminar) => ({ seminar, ts: new Date(seminar.date).getTime() }))
        .filter((item) => Number.isFinite(item.ts) && item.ts >= now)
        .sort((a, b) => a.ts - b.ts)[0]?.seminar;

      setUpcomingSeminar(upcoming ?? activeSeminars[0] ?? null);
    };

    loadSeminars();

    return () => {
      mounted = false;
    };
  }, []);

  const countdownItems = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  const heroDate = upcomingSeminar?.date ?? config?.heroDate ?? "April 27, 2026";
  const heroTime = upcomingSeminar?.time ?? config?.heroTime ?? "7:00 PM - 9:00 PM IST";
  const heroPrice = upcomingSeminar?.price ?? config?.heroPrice ?? 199;
  const heroOriginalPrice = upcomingSeminar?.originalPrice ?? config?.heroOriginalPrice ?? 999;
  const heroTitle = pickText(config?.heroTitle, "Feeling Lost in Life? Find Clarity Through");
  const heroHighlight = pickText(config?.heroHighlight, "Bhagavad Gita Wisdom");
  const heroSubtext = pickText(
    config?.heroSubtext,
    "Join India's most practical ancient wisdom seminar. Real answers. Real transformation."
  );
  const showHeroSkeleton = configLoading;

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-charcoal px-4 py-16 text-ivory sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.68_0.19_42/0.2)_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:content-[''] before:opacity-[0.08] before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYwJyBoZWlnaHQ9JzE2MCcgdmlld0JveD0nMCAwIDE2MCAxNjAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGZpbHRlciBpZD0nYSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuODUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTYwJyBoZWlnaHQ9JzE2MCcgZmlsdGVyPSd1cmwoI2EpJyBvcGFjaXR5PScxJy8+PC9zdmc+')]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        {showHeroSkeleton ? (
          <Skeleton className="h-8 w-56 rounded-full border border-saffron/35 bg-saffron/10" />
        ) : config?.showAnnouncement ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron/60 bg-saffron/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-saffron">
            <Flame className="size-3.5" />
            <span>{config.announcementText}</span>
          </span>
        ) : null}

        <div className="max-w-4xl space-y-5">
          {showHeroSkeleton ? (
            <div className="mx-auto w-full max-w-4xl space-y-5">
              <div className="space-y-3">
                <Skeleton className="mx-auto h-12 w-11/12 rounded-xl md:h-16" />
                <Skeleton className="mx-auto h-12 w-8/12 rounded-xl md:h-16" />
                <Skeleton className="mx-auto h-12 w-7/12 rounded-xl md:h-16" />
                <Skeleton className="mx-auto h-12 w-5/12 rounded-xl bg-saffron/25 md:h-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="mx-auto h-5 w-10/12 rounded-lg" />
                <Skeleton className="mx-auto h-5 w-7/12 rounded-lg" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-5xl font-bold leading-tight md:text-7xl">
                {heroTitle}{" "}
                <span className="text-saffron">{heroHighlight}</span>
              </h1>
              <p className="mx-auto max-w-2xl font-body text-lg text-muted-warm">
                {heroSubtext}
              </p>
            </>
          )}
        </div>

        {showHeroSkeleton ? (
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        ) : (
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-ivory/85">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-saffron" />
              <span>{heroDate}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-saffron" />
              <span>{heroTime}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <Users className="size-4 text-saffron" />
              <span>Limited Seats</span>
            </div>
          </div>
        )}

        {showHeroSkeleton ? (
          <Skeleton className="h-12 w-64 rounded-full border border-gold/35" />
        ) : (
          <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-5 py-2">
            <span className="text-2xl font-bold text-gold">₹{heroPrice} Only</span>
            <span className="text-sm text-ivory/60 line-through">₹{heroOriginalPrice}</span>
          </div>
        )}

        {showHeroSkeleton ? (
          <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
            <Skeleton className="h-12 w-full rounded-full sm:w-60" />
            <Skeleton className="h-12 w-full rounded-full sm:w-44" />
          </div>
        ) : (
          <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="h-12 w-full rounded-full bg-saffron px-8 text-base font-semibold text-charcoal hover:bg-gold sm:w-auto"
              onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })}
            >
              Reserve Your Seat Now
            </Button>
            <Button
              variant="ghost"
              className="h-12 w-full rounded-full border border-saffron/40 bg-transparent px-8 text-base text-ivory hover:bg-saffron/10 sm:w-auto"
            >
              Watch Intro
            </Button>
          </div>
        )}

        {showHeroSkeleton ? (
          <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-xl border border-gold/35" />
            ))}
          </div>
        ) : (
          <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gold/40 bg-charcoal/60 px-4 py-4 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-gold">{item.value.toString().padStart(2, "0")}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-ivory/70">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {showHeroSkeleton ? (
          <Skeleton className="h-105 w-full max-w-5xl rounded-2xl border border-saffron/20" />
        ) : (
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-saffron/20 shadow-2xl">
            <Image
              src="https://res.cloudinary.com/dhmqkdh7w/image/upload/v1775830925/4_varidz.png"
              alt="People meditating in a peaceful seminar setting"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/55 via-charcoal/10 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
