'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  const t = useTranslations('LandingPage');

  return (
    <section id='section-hero'>
      <div className='relative z-[1] overflow-hidden rounded-bl-[30px] rounded-br-[30px] bg-colorLinenRuffle dark:bg-gray-800 pb-20 pt-28 lg:rounded-bl-[50px] lg:rounded-br-[50px] lg:pb-24 lg:pt-32 xl:pt-40 xxl:pb-[133px] xxl:pt-[195px]'>
        <div className='global-container'>
          <div className='mb-14 flex flex-col items-center text-center lg:mb-20'>
            <h1 className='mb-6 max-w-[510px] lg:max-w-[768px] xl:max-w-[1076px] dark:text-white' data-animate>
              {t('hero.title')}
            </h1>
            <p className='mb-11 max-w-[700px] text-lg font-semibold sm:text-xl xl:max-w-[980px] dark:text-gray-300' data-animate>
              {t('hero.subtitle')}
            </p>
            <div
              className='flex flex-wrap justify-center gap-6'
              data-animate
            >
              <Link
                href='/tr/auth/signup'
                className='button rounded-[50px] border-2 border-black dark:border-white bg-black dark:bg-white py-4 text-white dark:text-black after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
              >
                {t('hero.cta.primary')}
              </Link>
              <Link
                href='#features'
                className='button rounded-[50px] border-2 border-black dark:border-white bg-transparent py-4 text-black dark:text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
              >
                {t('hero.cta.secondary')}
              </Link>
            </div>
          </div>
          <div
            className='jos hero-img overflow-hidden rounded-2xl bg-black dark:bg-gray-700'
            data-jos_animation='zoom'
          >
            <Image
              src='/assets/img_placeholder/th-1/hero-dashboard.jpg'
              alt='hero-dashboard'
              width={1296}
              height={640}
              className='h-auto w-full'
            />
              </div>
              
          <div className='my-10 h-[1px] w-full bg-[#DBD6CF] dark:bg-gray-700 lg:my-16 xl:my-20'></div>
          <div className='jos mx-auto mb-12 max-w-[715px] text-center lg:mb-16'>
            <p className='text-lg dark:text-gray-400'>
              {t('hero.trustText')}
                        </p>
                      </div>
          <div className='jos brand-slider' data-jos_animation='fade'>
            {/* Brand logos will be added here */}
            <div className='flex items-center justify-center gap-8'>
              <div className='h-8 w-32 bg-gray-300 rounded'></div>
              <div className='h-8 w-32 bg-gray-300 rounded'></div>
              <div className='h-8 w-32 bg-gray-300 rounded'></div>
              <div className='h-8 w-32 bg-gray-300 rounded'></div>
              <div className='h-8 w-32 bg-gray-300 rounded'></div>
            </div>
          </div>
        </div>
        <div className='orange-gradient-1 absolute -right-[150px] top-[370px] -z-[1] h-[500px] w-[500px] animate-spin rounded-[500px]'></div>
        <div className='orange-gradient-2 absolute right-[57px] top-[620px] -z-[1] h-[450px] w-[450px] animate-spin rounded-[450px]'></div>
      </div>
    </section>
  );
}