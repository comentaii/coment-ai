'use client';

import styles from '@/styles/landing.module.css';

export function TestimonialsSection() {
  return (
    <section className={styles['testimonialsSection']}>
      <div className={styles['testimonialsContainer']}>
        <div className={styles['testimonialsHeader']}>
          <h2 className={styles['testimonialsTitle']}>
            Trusted by Leading Companies
          </h2>
          <p className={styles['testimonialsDescription']}>
            See how companies are transforming their hiring process with our platform
          </p>
        </div>

        <div className={styles['testimonialsGrid']}>
          {/* Testimonial 1 */}
          <div className={styles['testimonialCard']}>
            <div className={styles['testimonialHeader']}>
              <div className={`${styles['testimonialAvatar']} ${styles['testimonialAvatarBlue']}`}>
                <span className={`${styles['testimonialAvatarText']} ${styles['testimonialAvatarTextBlue']}`}>JS</span>
              </div>
              <div className={styles['testimonialInfo']}>
                <h4 className={styles['testimonialName']}>John Smith</h4>
                <p className={styles['testimonialRole']}>CTO, TechCorp</p>
              </div>
            </div>
            <p className={styles['testimonialText']}>
              "This platform has revolutionized our hiring process. We've reduced time-to-hire by 60% 
              and improved candidate quality significantly. The AI insights are incredibly accurate."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className={styles['testimonialCard']}>
            <div className={styles['testimonialHeader']}>
              <div className={`${styles['testimonialAvatar']} ${styles['testimonialAvatarGreen']}`}>
                <span className={`${styles['testimonialAvatarText']} ${styles['testimonialAvatarTextGreen']}`}>MJ</span>
              </div>
              <div className={styles['testimonialInfo']}>
                <h4 className={styles['testimonialName']}>Maria Johnson</h4>
                <p className={styles['testimonialRole']}>HR Director, InnovateLab</p>
              </div>
            </div>
            <p className={styles['testimonialText']}>
              "The automated CV analysis saves us hours every week. The live coding assessment 
              feature gives us real insights into candidate capabilities. Highly recommended!"
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className={styles['testimonialCard']}>
            <div className={styles['testimonialHeader']}>
              <div className={`${styles['testimonialAvatar']} ${styles['testimonialAvatarPurple']}`}>
                <span className={`${styles['testimonialAvatarText']} ${styles['testimonialAvatarTextPurple']}`}>DW</span>
              </div>
              <div className={styles['testimonialInfo']}>
                <h4 className={styles['testimonialName']}>David Wilson</h4>
                <p className={styles['testimonialRole']}>VP Engineering, StartupXYZ</p>
              </div>
            </div>
            <p className={styles['testimonialText']}>
              "Outstanding platform! The analytics dashboard provides valuable insights into our 
              hiring funnel. We've made better hiring decisions and reduced bias significantly."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}