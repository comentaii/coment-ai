'use client';

import Image from 'next/image';

export function TestimonialsSection() {
  return (
    <section className='testimonial-section'>
      {/* Section Spacer */}
      <div className='bg-black pb-40 pt-20 xl:pb-[200px] xl:pt-[130px]'>
        {/* Section Container */}
        <div className='global-container'>
          {/* Section Content Block */}
          <div className='mb-10 text-center lg:mb-16 xl:mb-20' data-animate>
            <div className='mx-auto max-w-[300px] lg:max-w-[600px] xl:max-w-[680px]'>
              <h2 className='text-white'>
                Positive feedback from our users
              </h2>
            </div>
          </div>
          {/* Section Content Block */}

          {/* Testimonial List */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' data-animate="stagger">
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                "This AI SaaS tool has revolutionized the way we process and
                analyze data. This is a game-changer for our business."
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-1.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Max Weber
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    HR Manager
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                It answers immediately, and we ve seen a significant
                reduction in response time. Our customers love it and so do
                we!
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-2.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Douglas Smith
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    Businessman
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                The integration process was seamless, and the results
                exceeded our expectations. Highly recommended!
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-3.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Sarah Johnson
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    Product Manager
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                Security is a top concern for us, and AI SaaS takes it
                seriously. It s a reassuring layer of protection for our
                organization.
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-4.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Jack Fayol
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    HR Manager
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                We were concerned about integrating their APIs were well
                documented, and their support team was super cool.
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-5.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Karen Lynn
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    Software Engineer
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
            {/* Testimonial Item */}
            <div
              className='flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
            >
              <div className='block'>
                <Image
                  src='/assets/img_placeholder/th-1/rating.svg'
                  alt='rating'
                  width='146'
                  height='25'
                />
              </div>
              <p>
                The return on investment has exceeded our expectations. it s
                an investment in the future of our business.
              </p>
              <div className='flex items-center gap-x-4'>
                <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
                  <Image
                    src='/assets/img_placeholder/th-1/testimonial-img-6.jpg'
                    alt='testimonial-img'
                    width='60'
                    height='60'
                    className='h-full w-full object-cover object-center'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <h6 className='text-white'>
                    Henry Ochi
                  </h6>
                  <span className='block text-sm font-light leading-[1.4]'>
                    CEO
                  </span>
                </div>
              </div>
            </div>
            {/* Testimonial Item */}
          </div>
          {/* Testimonial List */}
        </div>
        {/* Section Container */}
      </div>
      {/* Section Spacer */}
    </section>
  );
}