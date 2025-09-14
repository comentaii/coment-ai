'use client';

import Link from 'next/link';
import Image from 'next/image';
import useAccordion from '@/hooks/use-accordion';

export function CTASection() {
  const [activeIndex, handleAccordion] = useAccordion(0);

  return (
    <>
      {/*...::: FAQ Section Start :::... */}
      <section id='contact' className='faq-section'>
        {/* Section Spacer */}
        <div className='pb-20 xl:pb-[150px]'>
          {/* Section Container */}
          <div className='global-container'>
            <div className='grid grid-cols-1 gap-y-10 md:grid-cols-2' data-animate="stagger">
              {/* FAQ Left Block */}
              <div
                className='flex flex-col'
              >
                {/* Section Content Block */}
                <div className='mb-6'>
                  <div className='mx-auto md:mx-0 md:max-w-none'>
                    <h2>Freely ask us for more information</h2>
                  </div>
                </div>
                {/* Section Content Block */}
                <div className='text-lg leading-[1.4] lg:text-[21px]'>
                  <p className='mb-7 last:mb-0'>
                    Our AI SaaS solutions can be quickly deployed, enabling
                    users to start benefiting from AI capabilities without
                    lengthy setup and development times in fast-paced
                    industries.
                  </p>
                  <Link
                    href='/contact'
                    className='button mt-5 rounded-[50px] border-2 border-black bg-black py-4 text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white'
                  >
                    Ask you questions
                  </Link>
                </div>
              </div>
              {/* FAQ Left Block */}

              {/* FAQ Right Block */}
              <div
                className='jos md:ml-10 lg:ml-20 xl:ml-32'
                data-jos_animation='fade-left'
              >
                {/* Accordion*/}
                <ul className='accordion'>
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 0 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(0)}
                  >
                    <div className='accordion-header flex items-center justify-between'>
                      <h5>How do I start AI SaaS?</h5>
                      <div className='accordion-icon'>
                        <Image
                          src='/assets/img_placeholder/plus.svg'
                          width={24}
                          height={24}
                          alt='plus'
                        />
                      </div>
                    </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. You ll need to provide some basic
                        information and agree to our terms and conditions.
                      </p>
                    </div>
                  </li>
                  {/* Accordion items */}
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 1 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(1)}
                  >
                    <div className='accordion-header flex items-center justify-between'>
                      <h5>Can I customize AI SaaS solutions?</h5>
                      <div className='accordion-icon'>
                        <Image
                          src='/assets/img_placeholder/plus.svg'
                          width={24}
                          height={24}
                          alt='plus'
                        />
                      </div>
                    </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. You ll need to provide some basic
                        information and agree to our terms and conditions.
                      </p>
                    </div>
                  </li>
                  {/* Accordion items */}
                  {/* Accordion items */}
                  <li
                    className={`accordion-item border-b-[1px] border-[#DBD6CF] pb-6 pt-6 first:pt-0 last:border-b-0 last:pb-0 ${
                      activeIndex === 2 ? 'active' : ''
                    }`}
                    onClick={() => handleAccordion(2)}
                  >
                    <div className='accordion-header flex items-center justify-between'>
                      <h5>How can AI benefit my business?</h5>
                      <div className='accordion-icon'>
                        <Image
                          src='/assets/img_placeholder/plus.svg'
                          width={24}
                          height={24}
                          alt='plus'
                        />
                      </div>
        </div>
                    <div className='accordion-content text-[#2C2C2C]'>
                      <p>
                        Go to the our official website and require users to
                        create an account. Youll need to provide some basic
                        information and agree to our terms and conditions.
        </p>
      </div>
                  </li>
                </ul>
                {/* Accordion*/}
              </div>
              {/* FAQ Right Block */}
            </div>
          </div>
          {/* Section Container */}
        </div>
        {/* Section Spacer */}
    </section>
      {/*...::: FAQ Section End :::... */}

      {/* Body Background Shape 1 */}
      <div className='orange-gradient-1 absolute -left-[15px] top-[61%] -z-[1] h-[400px] w-[400px] -rotate-[-9.022deg] rounded-[400px]'></div>

      {/* Body Background Shape 2 */}
      <div className='orange-gradient-2 absolute -left-[100px] top-[64%] -z-[1] h-[360px] w-[360px] -rotate-[-9.022deg] rounded-[360px]'></div>
    </>
  );
}