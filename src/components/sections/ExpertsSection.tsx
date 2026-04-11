import Image from "next/image";
import { Award, BookOpen, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const credentials = [
  "ISKCON Monk - 10+ Years",
  "M.Tech from IIT",
  "Manager of IYF Bhopal",
  "1000+ Lives Impacted",
  "EthicCraft Club Co-Professor",
];

const stats = [
  {
    icon: Award,
    value: "10 Years",
    label: "as monk",
  },
  {
    icon: Users,
    value: "1000+",
    label: "people helped",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "seminars conducted",
  },
];

export default function ExpertsSection() {
  return (
    <section id="experts" className="bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">YOUR GUIDES</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            Learn from Monks Who&apos;ve Walked the Path
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            Not YouTubers. Not motivational speakers. Real monks with real training.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          <Card className="overflow-hidden border-saffron/25 bg-charcoal/80">
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-[38%]">
                <div className="h-full p-4 md:p-5">
                  <div className="relative h-80 overflow-hidden rounded-xl border border-saffron/45 shadow-[0_0_40px_oklch(0.68_0.19_42/0.26)] md:h-full md:min-h-105">
                    <Image
                      src="https://res.cloudinary.com/dhmqkdh7w/image/upload/v1775828407/1_gzwfz2.jpg"
                      alt="Spiritual teacher in a contemplative setting"
                      fill
                      sizes="(max-width: 767px) 100vw, 38vw"
                      className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/35 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              <CardContent className="flex-1 p-6 sm:p-8">
                <h3 className="font-heading text-3xl font-bold text-ivory sm:text-4xl">
                  Dharmendra Krishna Das
                </h3>
                <p className="mt-2 font-body text-lg font-medium text-gold">
                  Vice President of ISKCON Bhopal BYC, Youth Trainer &amp; Life Coach
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {credentials.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="rounded-full border-saffron/35 bg-saffron/10 px-3 py-1 text-[11px] tracking-wide text-saffron"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>

                <p className="mt-6 max-w-2xl font-body text-base leading-relaxed text-muted-warm">
                  Dharmendra Krishna Das has dedicated his life to making timeless Gita wisdom practical
                  for students, professionals, and leaders. His mission is simple: help people replace
                  confusion with clarity and stress with purposeful action.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-gold/35 bg-gold/10 px-4 py-4 text-center"
                      >
                        <Icon className="mx-auto mb-2 size-5 text-gold" />
                        <p className="font-heading text-2xl font-bold text-gold">{stat.value}</p>
                        <p className="font-body text-xs uppercase tracking-wide text-ivory/75">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </div>
          </Card>

          <Card className="border-2 border-dashed border-saffron/20 bg-charcoal/60">
            <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-saffron/30 bg-saffron/10 text-saffron">
                <Plus className="size-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-ivory">More Experts Coming Soon</h3>
              <p className="mt-2 font-body text-sm text-muted-warm">
                We are onboarding more experienced monk mentors for upcoming sessions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
