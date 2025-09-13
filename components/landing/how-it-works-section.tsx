'use client';

import styles from '@/styles/landing.module.css';

export function HowItWorksSection() {
  return (
    <section className={styles['howItWorksSection']}>
      <div className={styles['howItWorksContainer']}>
        <div className={styles['howItWorksHeader']}>
          <h2 className={styles['howItWorksTitle']}>
            How It Works
          </h2>
          <p className={styles['howItWorksDescription']}>
            Get started in minutes with our simple 3-step process
          </p>
        </div>

        <div className={styles['howItWorksGrid']}>
          {/* Step 1 */}
          <div className={styles['stepCard']}>
            <div className={styles['stepNumber']}>
              1
            </div>
            <h3 className={styles['stepTitle']}>Upload CVs</h3>
            <p className={styles['stepDescription']}>
              Bulk upload candidate CVs in PDF format. Our AI automatically analyzes 
              and extracts key information, skills, and experience levels.
            </p>
          </div>

          {/* Step 2 */}
          <div className={styles['stepCard']}>
            <div className={styles['stepNumber']}>
              2
            </div>
            <h3 className={styles['stepTitle']}>Schedule Interviews</h3>
            <p className={styles['stepDescription']}>
              Select qualified candidates and schedule interviews. Generate unique 
              interview links and set up coding challenges tailored to the position.
            </p>
          </div>

          {/* Step 3 */}
          <div className={styles['stepCard']}>
            <div className={styles['stepNumber']}>
              3
            </div>
            <h3 className={styles['stepTitle']}>Evaluate & Hire</h3>
            <p className={styles['stepDescription']}>
              Monitor live coding sessions, get AI-powered insights, and make 
              data-driven hiring decisions with comprehensive candidate reports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}