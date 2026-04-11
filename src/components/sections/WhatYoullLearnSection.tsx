import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type Outcome = {
  title: string;
  description: string;
};

const outcomes: Outcome[] = [
  {
    title: "Make Decisions Without Fear",
    description: "Stop second-guessing yourself forever",
  },
  {
    title: "Kill Overthinking at the Root",
    description: "The Gita technique that silences the noisy mind",
  },
  {
    title: "Lead With Clarity & Purpose",
    description: "Understand the 3 types of leaders in Gita",
  },
  {
    title: "Handle Stress Effortlessly",
    description: "Krishna's formula for unshakeable inner peace",
  },
  {
    title: "Build Unbreakable Confidence",
    description: "Know your Dharma, own your path",
  },
  {
    title: "Manage People & Relationships",
    description: "Ancient wisdom for modern workplaces",
  },
  {
    title: "Find Your Life Purpose",
    description: "The 5-question framework from Gita Chapter 3",
  },
  {
    title: "Act Without Fear of Failure",
    description: "Nishkama Karma applied to real life",
  },
];

export default function WhatYoullLearnSection() {
  return (
    <section id="learn" className="relative bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-saffron/5" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <Badge variant="outline" className="border-saffron/45 bg-transparent tracking-[0.2em] text-saffron">
            PRACTICAL OUTCOMES
          </Badge>

          <h2 className="mt-5 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            What You&apos;ll Learn in This Seminar
          </h2>
          <p className="mt-4 max-w-2xl font-body text-lg text-muted-warm">
            Not theory. Not philosophy lectures. Real tools you can use from tomorrow.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {outcomes.map((outcome) => (
              <article
                key={outcome.title}
                className="rounded-xl border border-saffron/15 bg-charcoal/70 p-5 transition-colors duration-300 hover:border-saffron/35"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-saffron" />
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ivory">{outcome.title}</h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-muted-warm">
                      {outcome.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl lg:sticky lg:top-24">
          <div className="relative overflow-hidden rounded-2xl border border-saffron/30 shadow-[0_0_50px_oklch(0.68_0.19_42/0.35)]">
            <Image
              src="https://res.cloudinary.com/dhmqkdh7w/image/upload/v1775828505/2_bznpp4.png"
              alt="Person meditating with scripture in a calm space"
              width={1200}
              height={1400}
              className="h-full min-h-120 w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/35 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
