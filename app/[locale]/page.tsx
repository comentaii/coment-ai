'use client';

import { useAuth } from '@/hooks/use-auth';
import { LandingLayout } from '@/components/landing/landing-layout';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FunfactSection } from '@/components/landing/funfact-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  return (
    <LandingLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FunfactSection />
      <PricingSection />
      <CTASection />
      <TestimonialsSection />
    </LandingLayout>
  );
} 
