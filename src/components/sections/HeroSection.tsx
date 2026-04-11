"use client";

import Image from "next/image";
import { CalendarDays, Clock3, Flame, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

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

export default function HeroSection() {
  const targetDateRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    targetDateRef.current = Date.now() + 6 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000;
    setCountdown(getTimeLeft(targetDateRef.current));

    const interval = setInterval(() => {
      if (targetDateRef.current) {
        setCountdown(getTimeLeft(targetDateRef.current));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdownItems = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-charcoal px-4 py-16 text-ivory sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.68_0.19_42/0.2)_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 before:absolute before:inset-0 before:content-[''] before:opacity-[0.08] before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYwJyBoZWlnaHQ9JzE2MCcgdmlld0JveD0nMCAwIDE2MCAxNjAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGZpbHRlciBpZD0nYSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuODUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTYwJyBoZWlnaHQ9JzE2MCcgZmlsdGVyPSd1cmwoI2EpJyBvcGFjaXR5PScxJy8+PC9zdmc+')]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron/60 bg-saffron/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-saffron">
          <Flame className="size-3.5" />
          <span>Limited Seats Available</span>
        </span>

        <div className="max-w-4xl space-y-5">
          <h1 className="font-heading text-5xl font-bold leading-tight md:text-7xl">
            Feeling Lost in Life? Find Clarity Through{" "}
            <span className="text-saffron">Bhagavad Gita Wisdom</span>
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg text-muted-warm">
            Join India&apos;s most practical ancient wisdom seminar. Real answers. Real transformation.
          </p>
        </div>

        <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-ivory/85">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-saffron" />
            <span>April 27, 2026</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock3 className="size-4 text-saffron" />
            <span>7:00 PM - 9:00 PM IST</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Users className="size-4 text-saffron" />
            <span>Limited Seats</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-5 py-2">
          <span className="text-2xl font-bold text-gold">₹149 Only</span>
          <span className="text-sm text-ivory/60 line-through">₹999</span>
        </div>

        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:flex-row">
          <Button className="h-12 w-full rounded-full bg-saffron px-8 text-base font-semibold text-charcoal hover:bg-gold sm:w-auto">
            Reserve Your Seat Now
          </Button>
          <Button
            variant="ghost"
            className="h-12 w-full rounded-full border border-saffron/40 bg-transparent px-8 text-base text-ivory hover:bg-saffron/10 sm:w-auto"
          >
            Watch Intro
          </Button>
        </div>

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
      </div>
    </section>
  );
}
