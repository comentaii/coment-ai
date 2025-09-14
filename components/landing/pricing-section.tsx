'use client';

import Link from 'next/link';
import useTabs from '@/hooks/use-tabs';

export function PricingSection() {
  const [activeTab, handleTab] = useTabs(0);

  return (
    <section id='pricing' className='pricing-section'>
      {/* Section Spacer */}
      <div className='pb-20 pt-20 xl:pb-[150px] xl:pt-[130px]'>
        {/* Section Container */}
        <div className='global-container'>
          {/* Section Content Block */}
          <div className='mb-10 text-center lg:mb-12' data-animate>
            <div className='mx-auto md:max-w-xs lg:max-w-xl xl:max-w-[746px]'>
              <h2>Cost-effectively build any software</h2>
            </div>
          </div>
          {/* Section Content Block */}
          {/* Pricing Block */}
          <div className='container mx-auto'>
            {/* Tab buttons */}
            <div
              className='flex justify-center'
              data-animate
            >
              <div className='inline-flex space-x-4 rounded-[50px] border-2 border-black font-semibold'>
                <button
                  className={`tab-button price-button ${
                    activeTab === 0 ? 'active' : ''
                  }`}
                  onClick={() => handleTab(0)}
                  data-tab='monthly'
                >
                  Monthly
                </button>
                <button
                  className={`tab-button price-button ${
                    activeTab === 1 ? 'active' : ''
                  }`}
                  onClick={() => handleTab(1)}
                  data-tab='annually'
                >
                  Annually
                </button>
            </div>
            </div>

            {/* Pricing Block */}
            <div className='mt-12 lg:mt-16 xl:mt-20'>
              {/* Price List */}
              <div className={activeTab === 0 ? 'block' : 'hidden'}>
                <ul
                  id='monthly'
                  className='tab-content grid grid-cols-1 gap-6 lg:grid-cols-3'
                  data-animate="stagger"
                >
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Beginner
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 10 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $25
                      <span className='text-lg font-semibold'>
                        /Per month
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      This is an excellent option for people & small
                      businesses who are starting out.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
                  </li>
                  {/* Price Item */}
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Starter
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 50 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $89
                      <span className='text-lg font-semibold'>
                        /Per month
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      This plan is suitable for e-commerce stores as well as
                      professional blogs.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
              </li>
                  {/* Price Item */}
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Pro
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 100 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $199
                      <span className='text-lg font-semibold'>
                        /Per month
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Ideal for handling complicated projects
                      enterprise-level projects, and websites.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
              </li>
                  {/* Price Item */}
                </ul>
              </div>
              {/* Price List */}
              {/* Price List */}
              <div className={activeTab === 1 ? 'block' : 'hidden'}>
                <ul
                  id='annually'
                  className='tab-content grid grid-cols-1 gap-6 lg:grid-cols-3'
                  data-animate="stagger"
                >
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Beginner
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 10 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $240
                      <span className='text-lg font-semibold'>
                        /Per year
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      This is an excellent option for people & small
                      businesses who are starting out.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
              </li>
                  {/* Price Item */}
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Starter
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 50 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $850
                      <span className='text-lg font-semibold'>
                        /Per year
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      This plan is suitable for e-commerce stores as well as
                      professional blogs.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
              </li>
                  {/* Price Item */}
                  {/* Price Item */}
                  <li
                    className='group flex flex-col rounded-[10px] bg-colorLinenRuffle p-10 transition-all duration-300 ease-linear hover:bg-black'
                  >
                    <h5 className='text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Pro
                    </h5>
                    <span className='text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Up to 100 members
                    </span>

                    <div className='my-5 h-[1px] w-full bg-[#DBD6CF]'></div>
                    <div className='mb-4 font-dmSans text-5xl font-bold leading-none text-black transition-all duration-300 ease-linear group-hover:text-white md:text-6xl lg:text-7xl xl:text-[80px]'>
                      $1900
                      <span className='text-lg font-semibold'>
                        /Per year
                      </span>
                    </div>
                    <p className='mb-10 text-lg text-black transition-all duration-300 ease-linear group-hover:text-white'>
                      Ideal for handling complicated projects
                      enterprise-level projects, and websites.
                    </p>
                    <Link
                      href='/pricing'
                      className='button mt-auto block rounded-[50px] border-2 border-black bg-transparent py-4 text-center text-black transition-all duration-300 ease-linear after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-black group-hover:border-colorOrangyRed group-hover:text-white'
                    >
                      Choose the plan
                    </Link>
              </li>
                  {/* Price Item */}
            </ul>
          </div>
              {/* Price List */}
            </div>
            {/* Pricing Block */}
          </div>
          {/* Pricing Block */}
        </div>
        {/* Section Container */}
      </div>
      {/* Section Spacer */}
    </section>
  );
}