import Image from "next/image";
import { Brain, Briefcase, Heart, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Scenario = {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
};

const scenarios: Scenario[] = [
  {
    icon: Briefcase,
    title: "Career & Work",
    description:
      "Confused about job switch? Facing office politics? Gita gives you a decision framework.",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    alt: "Professional Indian work setting with focus and collaboration",
  },
  {
    icon: Heart,
    title: "Relationships",
    description:
      "Family pressure, partner conflicts, friendship stress - learn to respond, not react.",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    alt: "People sharing an emotional and supportive relationship moment",
  },
  {
    icon: Brain,
    title: "Mind & Mental Health",
    description:
      "Anxiety, overthinking, imposter syndrome - the monk's formula for a calm mind.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    alt: "Meditative setting representing calm and mental clarity",
  },
];

export default function RealLifeSection() {
  return (
    <section id="apply" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">
            APPLY THIS IN REAL LIFE
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            Ancient Wisdom. Modern Problems. Real Solutions.
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            Every teaching in this seminar is mapped to a real-life situation you face today.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;

            return (
              <Card
                key={scenario.title}
                className="group relative h-117.5 overflow-hidden border-saffron/15 bg-charcoal transition-all duration-300 hover:scale-[1.02] hover:border-saffron"
              >
                <Image
                  src={scenario.image}
                  alt={scenario.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/45 to-charcoal/30" />

                <CardContent className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-saffron/30 bg-saffron/12 text-saffron">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-ivory">{scenario.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ivory/80">{scenario.description}</p>
                  <a
                    href="#"
                    className="mt-4 inline-flex text-sm font-semibold text-saffron transition-colors hover:text-gold"
                  >
                    Learn More →
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
