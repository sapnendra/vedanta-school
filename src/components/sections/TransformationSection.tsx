import { ArrowDown, ArrowRight, Frown, Smile } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const beforeItems = ["Confused", "Overthinking", "Lost", "Anxious", "Reactive"];
const afterItems = ["Clear", "Decisive", "Purposeful", "Peaceful", "In Control"];

export default function TransformationSection() {
  return (
    <section id="transformation" className="relative overflow-hidden bg-charcoal px-4 py-20 sm:px-6 lg:px-8">
      <div className="journey-pattern pointer-events-none absolute inset-0 opacity-80" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-saffron">YOUR JOURNEY</p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-ivory sm:text-5xl">
            From Self-Doubt to Unshakeable Confidence
          </h2>
          <p className="mt-4 font-body text-lg text-muted-warm">
            Every teaching in this seminar is mapped to a real-life situation you face today.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-stretch justify-center gap-5 lg:flex-row lg:items-center lg:gap-6">
          <Card className="flex-1 border-red-400/20 bg-red-500/7">
            <CardHeader>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-red-300/20 bg-red-400/10 text-red-300">
                <Frown className="size-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-ivory">Where You Are Now</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {beforeItems.map((item) => (
                  <li key={item} className="font-body text-base text-ivory/85">
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex shrink-0 flex-col items-center justify-center gap-3 py-2">
            <Badge className="rounded-full bg-saffron px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-charcoal">
              2 Hours with Gita
            </Badge>
            <ArrowRight className="journey-arrow hidden size-12 text-gold drop-shadow-[0_0_18px_oklch(0.72_0.14_75/0.6)] lg:block" />
            <ArrowDown className="journey-arrow size-12 text-gold drop-shadow-[0_0_18px_oklch(0.72_0.14_75/0.6)] lg:hidden" />
          </div>

          <Card className="flex-1 border-saffron/30 bg-gold/7">
            <CardHeader>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-saffron/35 bg-saffron/15 text-saffron">
                <Smile className="size-5" />
              </div>
              <CardTitle className="text-2xl font-bold text-ivory">Where You&apos;ll Be</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {afterItems.map((item) => (
                  <li key={item} className="font-body text-base text-ivory/85">
                    • {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <blockquote className="mx-auto mt-12 max-w-4xl rounded-xl border-l-4 border-gold bg-white/4 p-6 font-body text-lg italic leading-relaxed text-muted-warm backdrop-blur-sm sm:p-8">
          &quot;You have the right to perform your duty, but not to the fruits of your actions.&quot; -
          Bhagavad Gita 2.47
        </blockquote>
      </div>
    </section>
  );
}
