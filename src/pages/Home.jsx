import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import VenueSection from '@/components/venues/VenueSection';
import FAQSection from '@/components/faq/FAQSection';
import VenuesMap from '@/components/map/VenuesMap';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <VenueSection />
      <FAQSection />
      <VenuesMap />
    </div>
  );
}
