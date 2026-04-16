"use client";

import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTestimonials } from "@/lib/api";
import type { ITestimonialData } from "@/types";

type Stat = {
  value: string;
  label: string;
};

type Testimonial = ITestimonialData;

const stats: Stat[] = [
  { value: "1000+", label: "Lives Transformed" },
  { value: "50+", label: "Seminars Conducted" },
  { value: "4.9", label: "Average Rating" },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        if (isMounted) {
          setTestimonials(data);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const marqueeCards = useMemo(
    () => (testimonials.length > 0 ? [...testimonials, ...testimonials] : []),
    [testimonials]
  );

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  };

  return (
    <section id="results" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron">PROVEN RESULTS</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            Real People. Real Transformation.
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">Over 10,000 lives impacted across India.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-gold/40 bg-charcoal/70 text-center">
              <CardContent className="p-6">
                <div className="font-heading text-4xl font-bold text-gold">{stat.value}</div>
                <p className="mt-2 font-body text-sm uppercase tracking-wide text-ivory/75">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative mt-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-charcoal to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-charcoal to-transparent" />

          {loading ? (
            <div className="flex w-max gap-5 pr-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={`testimonial-skeleton-${index}`} className="w-[320px] shrink-0 border-saffron/20 bg-white/5 backdrop-blur-md">
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="mt-6 flex items-center gap-3">
                      <Skeleton className="h-11 w-11 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((__, starIndex) => (
                        <Skeleton key={starIndex} className="h-4 w-4 rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="testimonials-track flex w-max gap-5 pr-5">
              {marqueeCards.map((item, index) => (
                <Card
                  key={`${item._id}-${index}`}
                  className="w-[320px] shrink-0 border-saffron/20 bg-white/5 backdrop-blur-md"
                >
                  <CardContent className="p-6">
                    <Quote className="size-6 text-gold" />
                    <p className="mt-4 font-body text-base leading-relaxed text-ivory/90 italic">{item.content}</p>

                    <div className="mt-6 flex items-center gap-3">
                      <Avatar className="size-11 border border-saffron/25">
                        <AvatarImage asChild>
                          <Image src={item.imageUrl} alt={item.name} width={96} height={96} className="object-cover" />
                        </AvatarImage>
                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-heading text-base font-semibold text-ivory">{item.name}</p>
                        <p className="font-body text-xs text-muted-warm">{item.role}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => {
                        const filled = starIndex < item.rating;
                        return (
                          <Star
                            key={starIndex}
                            className={filled ? "size-4 text-gold" : "size-4 text-ivory/25"}
                            fill={filled ? "currentColor" : "none"}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}