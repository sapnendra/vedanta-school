import { BookOpen, Shield, Users, Zap, type LucideIcon } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Differentiator = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const differentiators: Differentiator[] = [
  {
    icon: Zap,
    title: "100% Practical",
    description: "Every insight mapped to real decisions you face daily",
  },
  {
    icon: BookOpen,
    title: "5000 Years of Wisdom",
    description: "Ancient Gita teachings, not borrowed Western frameworks",
  },
  {
    icon: Users,
    title: "Monk-Certified Speakers",
    description: "Trained monks with corporate and academic credentials",
  },
  {
    icon: Shield,
    title: "Safe Learning Space",
    description: "No judgment. No religion pushing. Pure wisdom.",
  },
];

export default function WhyUsSection() {
  return (
    <section id="why" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">WHY VEDANTA LIFE SCHOOL</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            This Is Not Your Typical Seminar
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {differentiators.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="border-saffron/15 bg-charcoal/75 transition-colors duration-300 hover:border-saffron/40"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-saffron/30 bg-saffron/10 text-saffron">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-ivory">{item.title}</CardTitle>
                  <CardDescription className="mt-2 text-base leading-relaxed text-muted-warm">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="my-14 h-px w-full bg-linear-to-r from-transparent via-saffron/25 to-transparent" />

        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">RECOGNITION</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            Get Your Certificate of Completion
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            A proof of your commitment to growth and wisdom.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative rounded-2xl bg-charcoal/70 p-2 ring-2 ring-gold/50 ring-offset-4 ring-offset-charcoal">
            <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-linear-to-b from-gold/10 via-charcoal/70 to-charcoal/90 p-8 sm:p-10">
              <div className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-gold/60" />
              <div className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-gold/60" />
              <div className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-gold/60" />
              <div className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-gold/60" />

              <div className="text-center">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-saffron">Vedanta Life School</p>
                <h3 className="mt-3 font-heading text-3xl font-bold text-gold sm:text-4xl">
                  Certificate of Completion
                </h3>
                <p className="mt-4 font-body text-sm text-muted-warm">
                  This certifies that
                </p>
                <div className="mx-auto mt-4 max-w-xl border-b border-dashed border-gold/45 px-4 pb-2">
                  <p className="font-heading text-2xl font-semibold text-ivory">Your Name Here</p>
                </div>
                <p className="mx-auto mt-4 max-w-2xl font-body text-sm text-ivory/80">
                  has successfully completed the Bhagavad Gita Wisdom Seminar and demonstrated
                  commitment to practical personal transformation.
                </p>

                <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-gold/20 pt-6 sm:flex-row">
                  <div className="text-left">
                    <p className="font-heading text-lg font-semibold text-ivory">Vedanta Life School</p>
                    <p className="font-body text-xs uppercase tracking-wide text-muted-warm">
                      Authorized Learning Initiative
                    </p>
                  </div>

                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/60 bg-saffron/15 shadow-[0_0_22px_oklch(0.72_0.14_75/0.35)]">
                    <div className="h-12 w-12 rounded-full border border-gold/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center font-body text-sm italic text-muted-warm">
            Certificate is secondary. Transformation is primary.
          </p>
        </div>
      </div>
    </section>
  );
}
