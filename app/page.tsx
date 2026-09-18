"use client";

import FoldLayout from "@/components/FoldLayout";
import Hero from "@/components/Hero";
import StatementSection from "@/components/StatementSection";
import PillarsBento from "@/components/PillarsBento";
import EventsGallery from "@/components/EventsGallery";
import ResourceTeaser from "@/components/ResourceTeaser";
import MethodologySection from "@/components/MethodologySection";

export default function Home() {
  return (
    <FoldLayout>
      <main className="grow">
        <Hero />
        <StatementSection />
        <PillarsBento />
        <EventsGallery />
        <ResourceTeaser />
        <MethodologySection />
      </main>
    </FoldLayout>
  );
}
