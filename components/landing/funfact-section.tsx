'use client';

import Image from 'next/image';

export function FunfactSection() {
  return (
    <section id='funfact-section'>
      <div className='mx-auto max-w-[1500px] px-5'>
        <div className='grid grid-cols-1 overflow-hidden rounded-[30px] bg-black lg:rounded-[50px] xl:grid-cols-[minmax(400px,_1fr)_1.5fr] xxl:grid-cols-[1fr_minmax(800px,_1fr)]' data-animate>
          {/* Funfact Left Block */}
          <div className='relative overflow-hidden rounded-[30px] lg:rounded-[50px]'>
            <Image
              src='/assets/img_placeholder/th-1/funfact-image.jpg'
              alt='funfact-image'
              width='721'
              height='784'
              className='h-80 w-full object-cover object-center lg:h-[35rem] xl:h-full'
            />
            {/* Video Play Button */}
            <a
              data-fslightbox='gallery'
              rel='noopener noreferrer'
              href='https://www.youtube.com/watch?v=3nQNiWdeH2Q'
              className='absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2'
            >
              <div className='relative flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-black text-lg font-bold backdrop-blur-[2px] transition-all duration-300 hover:bg-colorOrangyRed hover:text-white'>
                <Image
                  src='/assets/img_placeholder/th-1/icon-play.svg'
                  alt='icon-play'
                  width='24'
                  height='24'
                  className='ml-1'
                />
              </div>
            </a>
          </div>
          {/* Funfact Left Block */}
          {/* Funfact Right Block */}
          <div className='flex flex-col justify-center p-10 lg:p-16 xl:p-20'>
            {/* Section Content Block */}
            <div className='mb-6'>
              <h2 className='font-clashDisplay text-4xl font-medium leading-[1.06] text-white sm:text-[44px] lg:text-[56px] xl:text-[75px]'>
                Expression of like human attitude
              </h2>
            </div>
            {/* Section Content Block */}
            <div className='text-lg leading-[1.66] text-white'>
              <p className='mb-7 last:mb-0'>
                Our AI chatbots excel at understanding natural language
                and generating human-like responses. Adapting your
                conversational style to our chatbot can improve the
                quality of your interactions.
              </p>
              <ul className='mt-12 flex flex-col gap-y-6 font-clashDisplay text-[22px] font-medium leading-[1.28] tracking-[1px] lg:text-[28px]'>
                <li className='relative pl-[35px] after:absolute after:left-[10px] after:top-3 after:h-[15px] after:w-[15px] after:rounded-[50%] after:bg-colorViolet'>
                  Use natural language as you were talking
                </li>
                <li className='relative pl-[35px] after:absolute after:left-[10px] after:top-3 after:h-[15px] after:w-[15px] after:rounded-[50%] after:bg-colorViolet'>
                  The conversation with a polite greeting
                </li>
                <li className='relative pl-[35px] after:absolute after:left-[10px] after:top-3 after:h-[15px] after:w-[15px] after:rounded-[50%] after:bg-colorViolet'>
                  Feel free to use emotions and expressions
                </li>
              </ul>
            </div>
          </div>
          {/* Funfact Right Block */}
        </div>
      </div>
    </section>
  );
}
