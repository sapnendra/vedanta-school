"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ExpertsSection from "@/components/sections/ExpertsSection";
import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import RealLifeSection from "@/components/sections/RealLifeSection";
import RegistrationForm from "@/components/sections/RegistrationForm";
import SeminarsSlider from "@/components/sections/SeminarsSlider";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import TransformationSection from "@/components/sections/TransformationSection";
import WhatYoullLearnSection from "@/components/sections/WhatYoullLearnSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

function RevealSection({
  children,
  delayClass,
}: {
  children: React.ReactNode;
  delayClass?: "delay-100" | "delay-200" | "delay-300";
}) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn("opacity-0", isInView && "animate-fade-up", isInView && delayClass)}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-charcoal pb-20 md:pb-0">
      <Navbar />
      <RevealSection>
        <HeroSection />
      </RevealSection>
      <RevealSection delayClass="delay-100">
        <ProblemSection />
      </RevealSection>
      <RevealSection delayClass="delay-200">
        <TestimonialsSection />
      </RevealSection>
      <RevealSection delayClass="delay-300">
        <WhatYoullLearnSection />
      </RevealSection>
      <RevealSection delayClass="delay-100">
        <RealLifeSection />
      </RevealSection>
      <RevealSection delayClass="delay-200">
        <TransformationSection />
      </RevealSection>
      <RevealSection delayClass="delay-300">
        <ExpertsSection />
      </RevealSection>
      <RevealSection delayClass="delay-100">
        <WhyUsSection />
      </RevealSection>
      <RevealSection delayClass="delay-200">
        <SeminarsSlider />
      </RevealSection>
      <RevealSection delayClass="delay-300">
        <RegistrationForm />
      </RevealSection>
      <Footer />
    </main>
  );
}
