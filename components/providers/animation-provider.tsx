'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Basit scroll animasyonu için Intersection Observer kullanıyoruz
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll animasyonları için Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
        }
      });
    }, observerOptions);

    // Tüm animasyon elementlerini bul ve gözlemle
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [pathname]);

  return <>{children}</>;
}
