import {
  BrainCircuit,
  Compass,
  Frown,
  ShieldOff,
  TrendingDown,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProblemCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const problems: ProblemCard[] = [
  {
    icon: BrainCircuit,
    title: "Constant Overthinking",
    description: "Your mind never stops. Decisions feel impossible.",
  },
  {
    icon: Compass,
    title: "No Life Direction",
    description: "You work hard but don't know where you're headed.",
  },
  {
    icon: ShieldOff,
    title: "Crippling Self Doubt",
    description: "You question yourself before every big moment.",
  },
  {
    icon: Frown,
    title: "Stuck in Stress",
    description: "Anxiety is your daily companion. Peace feels far.",
  },
  {
    icon: Users,
    title: "Relationship Conflicts",
    description: "You struggle to manage people and expectations.",
  },
  {
    icon: TrendingDown,
    title: "Career Confusion",
    description: "Multiple options, zero clarity on what to choose.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-saffron">WHY YOU&apos;RE HERE</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            Does Any of This Sound Like You?
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            You&apos;re not alone. Millions feel this way. And Gita has the answer.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => {
            const Icon = problem.icon;

            return (
              <Card
                key={problem.title}
                className="border-saffron/10 bg-charcoal/80 transition-colors duration-300 hover:border-saffron/40"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-saffron/20 bg-saffron/10 text-saffron">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-ivory">{problem.title}</CardTitle>
                  <CardDescription className="mt-3 text-base leading-relaxed text-muted-warm">
                    {problem.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <p className="mx-auto mt-12 max-w-3xl text-center font-body text-lg italic text-gold">
          If you nodded to even one of these - this seminar is for you.
        </p>
      </div>
    </section>
  );
}