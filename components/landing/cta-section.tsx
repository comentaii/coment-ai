'use client';

import styles from '@/styles/landing.module.css';

export function CTASection() {
  return (
    <section className={styles['ctaSection']}>
      <div className={styles['ctaContainer']}>
        <h2 className={styles['ctaTitle']}>
          Ready to Transform Your Hiring Process?
        </h2>
        <p className={styles['ctaDescription']}>
          Join thousands of companies already using our AI-powered platform to find the best talent faster and more efficiently.
        </p>
        <div className={styles['ctaButtons']}>
          <button className={styles['ctaButtonPrimary']}>
            Start Your Free Trial
          </button>
          <button className={styles['ctaButtonSecondary']}>
            Schedule a Demo
          </button>
        </div>
        <p className={styles['ctaNote']}>
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}