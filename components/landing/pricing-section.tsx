'use client';

import styles from '@/styles/landing.module.css';

export function PricingSection() {
  return (
    <section className={styles['pricingSection']}>
      <div className={styles['pricingContainer']}>
        <div className={styles['pricingHeader']}>
          <h2 className={styles['pricingTitle']}>
            Simple, Transparent Pricing
          </h2>
          <p className={styles['pricingDescription']}>
            Choose the plan that fits your hiring needs. All plans include our core AI features.
          </p>
        </div>

        <div className={styles['pricingGrid']}>
          {/* Starter Plan */}
          <div className={styles['pricingCard']}>
            <h3 className={`${styles['pricingCardTitle']} ${styles['pricingCardTitleGray']}`}>Starter</h3>
            <div className={styles['pricingCardPrice']}>
              <span className={`${styles['pricingCardPriceAmount']} ${styles['pricingCardPriceAmountGray']}`}>$99</span>
              <span className={`${styles['pricingCardPricePeriod']} ${styles['pricingCardPricePeriodGray']}`}>/month</span>
            </div>
            <ul className={styles['pricingCardFeatures']}>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Up to 50 CVs per month</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>10 interviews per month</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Basic analytics</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Email support</span>
              </li>
            </ul>
            <button className={`${styles['pricingCardButton']} ${styles['pricingCardButtonGray']}`}>
              Start Free Trial
            </button>
          </div>

          {/* Professional Plan */}
          <div className={styles['pricingCardFeatured']}>
            <div className={styles['pricingCardFeaturedBadge']}>
              <span className={styles['pricingCardFeaturedBadgeText']}>
                Most Popular
              </span>
            </div>
            <h3 className={`${styles['pricingCardTitle']} ${styles['pricingCardTitleWhite']}`}>Professional</h3>
            <div className={styles['pricingCardPrice']}>
              <span className={`${styles['pricingCardPriceAmount']} ${styles['pricingCardPriceAmountWhite']}`}>$299</span>
              <span className={`${styles['pricingCardPricePeriod']} ${styles['pricingCardPricePeriodWhite']}`}>/month</span>
            </div>
            <ul className={styles['pricingCardFeatures']}>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreenLight']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={`${styles['pricingCardFeatureText']} ${styles['pricingCardFeatureTextWhite']}`}>Up to 200 CVs per month</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreenLight']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={`${styles['pricingCardFeatureText']} ${styles['pricingCardFeatureTextWhite']}`}>50 interviews per month</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreenLight']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={`${styles['pricingCardFeatureText']} ${styles['pricingCardFeatureTextWhite']}`}>Advanced analytics</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreenLight']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={`${styles['pricingCardFeatureText']} ${styles['pricingCardFeatureTextWhite']}`}>Priority support</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreenLight']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={`${styles['pricingCardFeatureText']} ${styles['pricingCardFeatureTextWhite']}`}>Team collaboration</span>
              </li>
            </ul>
            <button className={`${styles['pricingCardButton']} ${styles['pricingCardButtonWhite']}`}>
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={styles['pricingCard']}>
            <h3 className={`${styles['pricingCardTitle']} ${styles['pricingCardTitleGray']}`}>Enterprise</h3>
            <div className={styles['pricingCardPrice']}>
              <span className={`${styles['pricingCardPriceAmount']} ${styles['pricingCardPriceAmountGray']}`}>$999</span>
              <span className={`${styles['pricingCardPricePeriod']} ${styles['pricingCardPricePeriodGray']}`}>/month</span>
            </div>
            <ul className={styles['pricingCardFeatures']}>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Unlimited CVs</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Unlimited interviews</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Custom analytics</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>24/7 dedicated support</span>
              </li>
              <li className={styles['pricingCardFeature']}>
                <svg className={`${styles['pricingCardFeatureIcon']} ${styles['pricingCardFeatureIconGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className={styles['pricingCardFeatureText']}>Custom integrations</span>
              </li>
            </ul>
            <button className={`${styles['pricingCardButton']} ${styles['pricingCardButtonGray']}`}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}