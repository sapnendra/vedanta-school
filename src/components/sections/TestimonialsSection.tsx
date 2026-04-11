import Image from "next/image";
import { Quote, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Stat = {
  value: string;
  label: string;
};

type Testimonial = {
  text: string;
  name: string;
  role: string;
  image: string;
  fallback: string;
};

const stats: Stat[] = [
  { value: "1000+", label: "Lives Transformed" },
  { value: "50+", label: "Seminars Conducted" },
  { value: "4.9", label: "Average Rating" },
];

const testimonials: Testimonial[] = [
  {
    text: "I was stuck between jobs and totally lost. The Gita-based frameworks gave me career clarity in a way no coach ever could.",
    name: "Rohan Malhotra",
    role: "Product Manager, Bengaluru",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    fallback: "RM",
  },
  {
    text: "As a team lead, I struggled with tough conversations. This seminar changed how I lead with calmness and conviction.",
    name: "Ananya Sharma",
    role: "Engineering Lead, Pune",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=240&q=80",
    fallback: "AS",
  },
  {
    text: "My stress levels were always high. The practical wisdom from the Gita helped me regain peace and focus daily.",
    name: "Vikram Nair",
    role: "Entrepreneur, Kochi",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    fallback: "VN",
  },
  {
    text: "I came for spiritual curiosity, but got concrete tools for decision-making, discipline, and emotional resilience.",
    name: "Neha Bansal",
    role: "MBA Student, Delhi",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    fallback: "NB",
  },
  {
    text: "For years I felt scattered. After one seminar, my priorities became crystal clear and my confidence returned.",
    name: "Arjun Mehta",
    role: "Sales Director, Mumbai",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    fallback: "AM",
  },
  {
    text: "The leadership lessons from Gita are timeless. I now handle pressure and people without burning out.",
    name: "Priya Iyer",
    role: "HR Head, Chennai",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=80",
    fallback: "PI",
  },
];

const marqueeCards = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
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

          <div className="testimonials-track flex w-max gap-5 pr-5">
            {marqueeCards.map((item, index) => (
              <Card
                key={`${item.name}-${index}`}
                className="w-[320px] shrink-0 border-saffron/20 bg-white/5 backdrop-blur-md"
              >
                <CardContent className="p-6">
                  <Quote className="size-6 text-gold" />
                  <p className="mt-4 font-body text-base leading-relaxed text-ivory/90 italic">{item.text}</p>

                  <div className="mt-6 flex items-center gap-3">
                    <Avatar className="size-11 border border-saffron/25">
                      <AvatarImage asChild>
                        <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover" />
                      </AvatarImage>
                      <AvatarFallback>{item.fallback}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-heading text-base font-semibold text-ivory">{item.name}</p>
                      <p className="font-body text-xs text-muted-warm">{item.role}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="size-4 fill-gold text-gold" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}