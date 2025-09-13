'use client';

import styles from '@/styles/landing.module.css';

export function FeaturesSection() {
  return (
    <section className={styles['featuresSection']}>
      <div className={styles['featuresContainer']}>
        <div className={styles['featuresHeader']}>
          <h2 className={styles['featuresTitle']}>
            Powerful AI Features
          </h2>
          <p className={styles['featuresDescription']}>
            Our platform combines cutting-edge AI with intuitive design to streamline your hiring process
          </p>
        </div>
        
        <div className={styles['featuresGrid']}>
          {/* Feature 1 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconBlue']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgBlue']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>AI CV Analysis</h3>
            <p className={styles['featureDescription']}>
              Automatically extract skills, experience levels, and quality scores from CVs. 
              Get instant insights on candidate qualifications.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconGreen']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>Smart Scheduling</h3>
            <p className={styles['featureDescription']}>
              Automated interview scheduling with calendar integration. 
              Generate unique interview links and manage multiple sessions effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconPurple']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgPurple']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>Live Coding Assessment</h3>
            <p className={styles['featureDescription']}>
              Real-time coding environment with AI-powered analysis. 
              Monitor candidate progress and get instant feedback on code quality.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconOrange']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgOrange']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>Analytics Dashboard</h3>
            <p className={styles['featureDescription']}>
              Comprehensive analytics and reporting. Track hiring metrics, 
              candidate performance, and optimize your recruitment process.
            </p>
          </div>

          {/* Feature 5 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconRed']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgRed']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>Secure & Compliant</h3>
            <p className={styles['featureDescription']}>
              Enterprise-grade security with GDPR compliance. 
              Protect candidate data with end-to-end encryption and secure storage.
            </p>
          </div>

          {/* Feature 6 */}
          <div className={styles['featureCard']}>
            <div className={`${styles['featureIcon']} ${styles['featureIconIndigo']}`}>
              <svg className={`${styles['featureIconSvg']} ${styles['featureIconSvgIndigo']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className={styles['featureTitle']}>Team Collaboration</h3>
            <p className={styles['featureDescription']}>
              Multi-user support with role-based access. 
              Collaborate with your team and share candidate evaluations seamlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}