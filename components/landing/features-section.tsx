'use client';

import Image from 'next/image';
import Link from 'next/link';

export function FeaturesSection() {

  return (
    <section id='features'>
      {/* Section Spacer */}
      <div className='pb-20 pt-20 xl:pb-[150px] xl:pt-[130px]'>
        {/* Section Container */}
        <div className='global-container'>
          {/* Section Content Block */}
          <div className='mb-10 lg:mb-16 xl:mb-20' data-animate>
            <div className='md:max-w-sm lg:max-w-xl xl:max-w-[746px]'>
              <h2>Core features that make it valuable</h2>
            </div>
          </div>
          {/* Section Content Block */}
          {/* Service List */}
          <ul className='grid grid-cols-1 gap-[2px] overflow-hidden rounded-[10px] border-2 border-black dark:border-gray-700 bg-black dark:bg-gray-700 sm:grid-cols-2 lg:grid-cols-4' data-animate="stagger">
            {/* Service Item */}
            <li className='group bg-white dark:bg-gray-800 p-[30px] transition-all duration-300 ease-in-out hover:bg-black dark:hover:bg-gray-900'>
              <div className='relative mb-9 h-[70px] w-[70px]'>
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-black-1.svg'
                  alt=''
                  width='70'
                  height='70'
                />
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-orange-1.svg'
                  alt='service-icon-orange-1'
                  width='70'
                  height='70'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
            </div>
              <h4 className='mb-4 block leading-tight -tracking-[0.5px] text-black dark:text-white group-hover:text-white'>
                <Link
                  href='/service-details'
                  className='hover:text-colorOrangyRed'
                >
                  AI CV Analysis
                </Link>
              </h4>

              <p className='mb-12 duration-300 text-gray-700 dark:text-gray-400 group-hover:text-white'>
                Advanced AI analyzes CVs to extract technical skills, experience levels, and quality scores automatically.
              </p>

              <Link
                href='/service-details'
                className='relative inline-block h-[30px] w-[30px] duration-300'
              >
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-black.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                />
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-orange.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
              </Link>
            </li>
            {/* Service Item */}
            {/* Service Item */}
            <li className='group bg-white dark:bg-gray-800 p-[30px] transition-all duration-300 ease-in-out hover:bg-black dark:hover:bg-gray-900'>
              <div className='relative mb-9 h-[70px] w-[70px]'>
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-black-2.svg'
                  alt='service-icon-black-2'
                  width='70'
                  height='70'
                />
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-orange-2.svg'
                  alt='service-icon-orange-1'
                  width='70'
                  height='70'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
          </div>

              <h4 className='mb-4 block leading-tight -tracking-[0.5px] text-black dark:text-white group-hover:text-white'>
                <Link
                  href='/service-details'
                  className='hover:text-colorOrangyRed'
                >
                  Live Coding Assessment
                </Link>
              </h4>

              <p className='mb-12 duration-300 text-gray-700 dark:text-gray-400 group-hover:text-white'>
                Real-time coding environment with live monitoring, keystroke logging, and AI-powered analysis.
              </p>

              <Link
                href='/service-details'
                className='relative inline-block h-[30px] w-[30px] duration-300'
              >
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-black.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                />
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-orange.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
              </Link>
              {/* Features Item */}
              {/* Features Item */}
            </li>
            {/* Service Item */}
            {/* Service Item */}
            <li className='group bg-white dark:bg-gray-800 p-[30px] transition-all duration-300 ease-in-out hover:bg-black dark:hover:bg-gray-900'>
              <div className='relative mb-9 h-[70px] w-[70px]'>
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-black-3.svg'
                  alt='service-icon-black-3'
                  width='70'
                  height='70'
                />
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-orange-3.svg'
                  alt='service-icon-orange-3'
                  width='70'
                  height='70'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
          </div>
              <h4 className='mb-4 block leading-tight -tracking-[0.5px] text-black dark:text-white group-hover:text-white'>
                <Link
                  href='/service-details'
                  className='hover:text-colorOrangyRed'
                >
                  Smart Interview Scheduling
                </Link>
              </h4>

              <p className='mb-12 duration-300 text-gray-700 dark:text-gray-400 group-hover:text-white'>
                Automated scheduling with calendar integration, timezone handling, and reminder notifications.
              </p>

              <Link
                href='/service-details'
                className='relative inline-block h-[30px] w-[30px] duration-300'
              >
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-black.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                />
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-orange.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
              </Link>
            </li>
            {/* Service Item */}
            {/* Service Item */}
            <li className='group bg-white dark:bg-gray-800 p-[30px] transition-all duration-300 ease-in-out hover:bg-black dark:hover:bg-gray-900'>
              <div className='relative mb-9 h-[70px] w-[70px]'>
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-black-4.svg'
                  alt='service-icon-black-4'
                  width='70'
                  height='70'
                />
                <Image
                  src='/assets/img_placeholder/th-1/service-icon-orange-4.svg'
                  alt='service-icon-orange-4'
                  width='70'
                  height='70'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
          </div>
              <h4 className='mb-4 block leading-tight -tracking-[0.5px] text-black dark:text-white group-hover:text-white'>
                <Link
                  href='/service-details'
                  className='hover:text-colorOrangyRed'
                >
                  Real-time Analytics
                </Link>
              </h4>

              <p className='mb-12 duration-300 text-gray-700 dark:text-gray-400 group-hover:text-white'>
                Comprehensive analytics dashboard with performance metrics, candidate insights, and hiring trends.
              </p>

              <Link
                href='/service-details'
                className='relative inline-block h-[30px] w-[30px] duration-300'
              >
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-black.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                />
                <Image
                  src='/assets/img_placeholder/th-1/arrow-right-orange.svg'
                  alt='arrow-right-black'
                  width='30'
                  height='30'
                  className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
                />
              </Link>
            </li>
            {/* Service Item */}
          </ul>
          {/* Service List */}
        </div>
        {/* Section Container */}
      </div>
      {/* Section Spacer */}
    </section>
  );
}