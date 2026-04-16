"use client";

import Image from "next/image";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import { fetchSeminars } from "@/lib/api";
import type { ISeminarData } from "@/types";

type Seminar = ISeminarData;

const badgeStyles = [
  "bg-saffron text-charcoal",
  "bg-gold text-charcoal",
  "bg-ivory text-charcoal",
] as const;

const detailItems = (seminar: Seminar): Array<{ icon: LucideIcon; text: string }> => [
  { icon: Calendar, text: seminar.date },
  { icon: Clock, text: seminar.time },
  { icon: MapPin, text: "Online (Google Meet)" },
];

export default function SeminarsSlider() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadSeminars = async () => {
      try {
        const data = await fetchSeminars();
        if (isMounted) {
          setSeminars(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSeminars();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      setCardsPerView(window.innerWidth >= 1024 ? 3 : 1);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxStep = useMemo(
    () => Math.max(0, seminars.length - cardsPerView),
    [seminars.length, cardsPerView]
  );
  const clampedStep = Math.min(currentStep, maxStep);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev >= maxStep ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxStep]);

  const slideWidth = 100 / cardsPerView;

  const handlePrev = () => setCurrentStep((prev) => (prev <= 0 ? maxStep : prev - 1));
  const handleNext = () => setCurrentStep((prev) => (prev >= maxStep ? 0 : prev + 1));

  const handleReserve = (seminarId: string) => {
    const el = document.getElementById("register");
    el?.scrollIntoView({ behavior: "smooth" });
    sessionStorage.setItem("selectedSeminarId", seminarId);
  };

  return (
    <section id="seminars" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">UPCOMING SEMINARS</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">Choose Your Seminar</h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            Each session is a standalone transformation experience.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={loading || seminars.length === 0}
            className="rounded-full border border-saffron/30 text-saffron hover:bg-saffron/10"
            aria-label="Previous seminars"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={loading || seminars.length === 0}
            className="rounded-full border border-saffron/30 text-saffron hover:bg-saffron/10"
            aria-label="Next seminars"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="mt-5 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${clampedStep * slideWidth}%)` }}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="shrink-0 px-2" style={{ width: `${slideWidth}%` }}>
                    <SectionSkeleton type="card" count={1} />
                  </div>
                ))
              : seminars.map((seminar, index) => {
                  const tone = badgeStyles[index % badgeStyles.length];
                  const pct = seminar.seatsTotal > 0 ? (seminar.seatsFilled / seminar.seatsTotal) * 100 : 0;
                  const barColor = pct < 70 ? "bg-green-500" : pct < 90 ? "bg-yellow-500" : "bg-red-500";

                  return (
                    <div
                      key={seminar._id}
                      className="shrink-0 px-2"
                      style={{ width: `${slideWidth}%` }}
                    >
                      <Card className="h-full border-saffron/20 bg-charcoal/85 transition-colors duration-300 hover:border-saffron">
                        <CardContent className="p-5">
                          <Badge className={`${tone} rounded-full px-3 py-1`}>{seminar.badge}</Badge>

                          <div className="relative mt-4 overflow-hidden rounded-xl border border-saffron/15">
                            <Image
                              src={seminar.imageUrl}
                              alt={seminar.title}
                              width={900}
                              height={560}
                              className="h-48 w-full object-cover"
                            />
                          </div>

                          <h3 className="mt-4 font-heading text-2xl font-bold text-ivory">{seminar.title}</h3>
                          <p className="mt-2 min-h-12 font-body text-sm leading-relaxed text-muted-warm">
                            {seminar.description}
                          </p>

                          <div className="mt-4 space-y-2 text-xs text-ivory/85">
                            {detailItems(seminar).map((detail) => {
                              const Icon = detail.icon;
                              return (
                                <div key={detail.text} className="flex items-center gap-2">
                                  <Icon className="size-3.5 text-saffron" />
                                  <span>{detail.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-4 space-y-1">
                            <p className="text-xs text-ivory/80">{seminar.seatsFilled} of {seminar.seatsTotal} seats filled</p>
                            <Progress value={pct} indicatorClassName={barColor} className="h-1.5" />
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-3xl font-bold text-gold">₹{seminar.price}</span>
                              <span className="text-sm text-ivory/45 line-through">₹{seminar.originalPrice ?? 999}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleReserve(seminar._id)}
                            className="mt-5 w-full rounded-full bg-saffron text-charcoal hover:bg-gold"
                          >
                            Reserve Seat →
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {!loading && Array.from({ length: maxStep + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentStep(index)}
              className={
                index === clampedStep
                  ? "h-2.5 w-6 rounded-full bg-saffron"
                  : "h-2.5 w-2.5 rounded-full bg-saffron/35 hover:bg-saffron/60"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
