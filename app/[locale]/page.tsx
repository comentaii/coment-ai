'use client';

import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LandingLayout } from '@/components/landing/landing-layout';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  const { session } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (session) {
      router.push(`/${locale}/dashboard`);
    }
  }, [session, router, locale]);

  return (
    <LandingLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </LandingLayout>
  );
} 
