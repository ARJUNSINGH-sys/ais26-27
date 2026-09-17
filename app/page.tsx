import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatementSection from "@/components/StatementSection";
import PillarsBento from "@/components/PillarsBento";
import EventsGallery from "@/components/EventsGallery";
import ResourceTeaser from "@/components/ResourceTeaser";
import MethodologySection from "@/components/MethodologySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#0A0A0A] selection:bg-[#0A0A0A] selection:text-white">
        <Nav />
        <main className="grow">
          <Hero />
          <StatementSection />
          <PillarsBento />
          <EventsGallery />
          <ResourceTeaser />
          <MethodologySection />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
