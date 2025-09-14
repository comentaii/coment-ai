'use client';

import Image from 'next/image';

export function HowItWorksSection() {

  return (
    <>
      {/*...::: Content Section Start_1 :::... */}
      <section id='how-it-works'>
        {/* Section Spacer */}
        <div className='pb-20 xl:pb-[150px]'>
          {/* Section Container */}
          <div className='global-container'>
            <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20 xl:gap-28 xxl:gap-32' data-animate="stagger">
              {/* Content Left Block */}
              <div
                className='order-2 overflow-hidden rounded-md md:order-1'
              >
                <Image
                  src='/assets/img_placeholder/th-1/content-image-1.jpg'
                  alt='content-image-1'
                  width='526'
                  height='450'
                  className='h-auto w-full'
                />
              </div>
              {/* Content Left Block */}
              {/* Content Right Block */}
              <div
                className='jos order-1 md:order-2'
                data-jos_animation='fade-right'
              >
                {/* Section Content Block */}
                <div className='mb-6'>
                  <h2>Accessible to a wider audience</h2>
                </div>
                {/* Section Content Block */}
                <div className='text-lg leading-[1.4] lg:text-[21px]'>
                  <p className='mb-7 last:mb-0'>
                    Advanced AI capabilities accessible to a broader audience,
                    including small & medium-sized businesses and individuals
                    who may not have the resources or expertise to develop.
                  </p>
                  <p className='mb-7 last:mb-0'>
                    Our platform democratizes AI-powered hiring tools, making
                    enterprise-level assessment capabilities available to
                    companies of all sizes.
          </p>
        </div>
              </div>
              {/* Content Right Block */}
            </div>
          </div>
          {/* Section Container */}
        </div>
        {/* Section Spacer */}
      </section>
      {/*...::: Content Section End_1 :::... */}

      {/*...::: Content Section Start_2 :::... */}
      <section id='content-section-2'>
        {/* Section Spacer */}
        <div className='pb-20 xl:pb-[150px]'>
          {/* Section Container */}
          <div className='global-container'>
            <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20 xl:grid-cols-[minmax(0,_1.2fr)_1fr] xl:gap-28 xxl:gap-32'>
              {/* Content Left Block */}
              <div
                className='jos order-2 overflow-hidden rounded-md'
                data-jos_animation='fade-left'
              >
                <Image
                  src='/assets/img_placeholder/th-1/content-image-2.jpg'
                  alt='content-image-2'
                  width='526'
                  height='450'
                  className='h-auto w-full'
                />
              </div>
              {/* Content Left Block */}
              {/* Content Right Block */}
              <div className='jos order-1' data-jos_animation='fade-right'>
                {/* Section Content Block */}
                <div className='mb-6'>
                  <h2>Providing quick deploy solutions</h2>
            </div>
                {/* Section Content Block */}
                <div className='text-lg leading-[1.4] lg:text-[21px]'>
                  <p className='mb-7 last:mb-0'>
                    Our AI SaaS solutions can be quickly deployed, enabling
                    users to start benefiting from AI capabilities without
                    lengthy setup and development times in fast-paced
                    industries.
                  </p>
                  <ul className='flex flex-col gap-y-5 font-dmSans text-xl leading-tight tracking-tighter text-black lg:mt-12 lg:text-[28px]'>
                    <li className='flex items-start gap-x-3'>
                      <div className='mt-[2.5px] h-[30px] w-[30px]'>
                        <Image
                          src='/assets/img_placeholder/th-1/check-circle.svg'
                          alt='check-circle'
                          width='30'
                          height='30'
                          className='h-full w-full'
                        />
                      </div>
                      Ready-to-use AI capabilities system
                    </li>
                    <li className='flex items-start gap-x-3'>
                      <div className='mt-[2.5px] h-[30px] w-[30px]'>
                        <Image
                          src='/assets/img_placeholder/th-1/check-circle.svg'
                          alt='check-circle'
                          width='30'
                          height='30'
                          className='h-full w-full'
                        />
                      </div>
                      Users can quickly integrate AI features
                    </li>
                    <li className='flex items-start gap-x-3'>
                      <div className='mt-[2.5px] h-[30px] w-[30px]'>
                        <Image
                          src='/assets/img_placeholder/th-1/check-circle.svg'
                          alt='check-circle'
                          width='30'
                          height='30'
                          className='h-full w-full'
                        />
                      </div>
                      Time savings translate to cost savings
                    </li>
                  </ul>
                </div>
          </div>
              {/* Content Right Block */}
            </div>
          </div>
          {/* Section Container */}
        </div>
        {/* Section Spacer */}
    </section>
      {/*...::: Content Section End :::... */}
    </>
  );
}