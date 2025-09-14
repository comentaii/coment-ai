import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='relative z-[1] -mt-[70px] overflow-hidden rounded-tl-[30px] rounded-tr-[30px] bg-colorLinenRuffle lg:rounded-tl-[50px] lg:rounded-tr-[50px]'>
      {/* Footer Top */}
      <div className='py-[60px] xl:pb-[100px] xl:pt-[130px]'>
        <div className='overflow-hidden'>
          {/* Footer Text Slider */}
          <div className='footer-text-slider flex w-full items-center gap-x-[30px] whitespace-nowrap'>
            {/* Footer Slide Item  */}
            <Image
              src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
              alt='footer-text-slider-icon'
              width={60}
              height={60}
              className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
            />
            <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
              CodileAI ile işe alım
            </div>
            {/* Footer Slide Item  */}
            {/* Footer Slide Item  */}
            <Image
              src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
              alt='footer-text-slider-icon'
              width={60}
              height={60}
              className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
            />
            <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
              CodileAI ile işe alım
            </div>
            {/* Footer Slide Item  */}
            {/* Footer Slide Item  */}
            <Image
              src='/assets/img_placeholder/th-1/footer-text-slider-icon.svg'
              alt='footer-text-slider-icon'
              width={60}
              height={60}
              className='h-10 w-10 lg:h-[60px] lg:w-[60px]'
            />
            <div className='block font-dmSans text-4xl font-bold leading-none -tracking-[2px] text-black lg:text-6xl xl:text-7xl xxl:text-[80px]'>
              CodileAI ile işe alım
            </div>
            {/* Footer Slide Item  */}
          </div>
        </div>
      </div>
      {/* Footer Top */}
      {/* Footer Text Slider */}
      <div className='global-container'>
        <div className='h-[1px] w-full bg-[#DBD6CF]' />
        {/* Footer Center */}
        <div className='lg grid grid-cols-1 gap-10 py-[60px] md:grid-cols-[1fr_auto_auto] xl:grid-cols-[1fr_auto_auto_1fr] xl:gap-20 xl:py-[100px]'>
          {/* Footer Widget */}
          <div className='flex flex-col gap-y-6'>
            <Link href='/' className='inline-block'>
              <Image
                src='/logo-dark.png'
                alt='CodileAI Logo'
                width={120}
                height={40}
              />
            </Link>
            <p>
              CodileAI, teknik işe alım süreçlerini dijitalleştiren ve hızlandıran, 
              yapay zeka destekli bir aday değerlendirme ve mülakat platformudur. 
              Doğru yetenekleri doğru pozisyonlarla buluşturuyoruz.
            </p>
            <p>
              Website:{' '}
              <Link href='https://codile.ai'>www.codile.ai</Link>
            </p>
          </div>
          {/* Footer Widget */}
          {/* Footer Widget */}
          <div className='flex flex-col gap-y-6'>
            {/* Footer Title */}
            <h6 className='capitalize text-black'>
              Primary Pages
            </h6>
            {/* Footer Title */}
            {/* Footer Navbar */}
            <ul className='flex flex-col gap-y-[10px] capitalize'>
              <li>
                <Link
                  href='/'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href='/#features'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Özellikler
                </Link>
              </li>
              <li>
                <Link
                  href='/#how-it-works'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Nasıl Çalışır
                </Link>
              </li>
              <li>
                <Link
                  href='/#pricing'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link
                  href='/#contact'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          {/* Footer Widget */}
          {/* Footer Widget */}
          <div className='flex flex-col gap-y-6'>
            {/* Footer Title */}
            <h6 className='capitalize text-black'>
              Utility pages
            </h6>
            {/* Footer Title */}
            {/* Footer Navbar */}
            <ul className='flex flex-col gap-y-[10px] capitalize'>
              <li>
                <Link
                  href='/tr/auth/signup'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Kayıt Ol
                </Link>
              </li>
              <li>
                <Link
                  href='/tr/auth/signin'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link
                  href='/tr/dashboard'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href='/tr/candidates'
                  className='transition-all duration-300 ease-linear hover:text-colorOrangyRed'
                >
                  Adaylar
                </Link>
              </li>
            </ul>
          </div>
          {/* Footer Widget */}
          {/* Footer Widget */}
          <div className='hidden xl:block'></div>
          {/* Footer Widget */}
        </div>
        {/* Footer Center */}
      </div>
      {/* Footer Bottom */}
      <div className='global-container'>
        <div className='h-[1px] w-full bg-[#DBD6CF]' />
        <div className='flex flex-wrap items-center justify-center gap-5 py-9 md:justify-between'>
          {/* Footer Copyright */}
          <p>© 2024 CodileAI. All rights reserved.</p>
          {/* Footer Copyright */}
          {/* Footer Social */}
          <div className='flex items-center gap-x-[15px]'>
            <Link
              href='#'
              className='group flex h-[30px] w-[30px] items-center justify-center rounded-[50%] border border-black transition-all duration-300 ease-linear hover:bg-black'
            >
              <Image
                src='/assets/img_placeholder/th-1/icon-facebook.svg'
                alt='icon-facebook'
                width='12'
                height='12'
                className='transition-all duration-300 ease-linear group-hover:brightness-0 group-hover:invert'
              />
            </Link>
            <Link
              href='#'
              className='group flex h-[30px] w-[30px] items-center justify-center rounded-[50%] border border-black transition-all duration-300 ease-linear hover:bg-black'
            >
              <Image
                src='/assets/img_placeholder/th-1/icon-twitter.svg'
                alt='icon-twitter'
                width='12'
                height='12'
                className='transition-all duration-300 ease-linear group-hover:brightness-0 group-hover:invert'
              />
            </Link>
            <Link
              href='#'
              className='group flex h-[30px] w-[30px] items-center justify-center rounded-[50%] border border-black transition-all duration-300 ease-linear hover:bg-black'
            >
              <Image
                src='/assets/img_placeholder/th-1/icon-linkedin.svg'
                alt='icon-linkedin'
                width='12'
                height='12'
                className='transition-all duration-300 ease-linear group-hover:brightness-0 group-hover:invert'
              />
            </Link>
            <Link
              href='#'
              className='group flex h-[30px] w-[30px] items-center justify-center rounded-[50%] border border-black transition-all duration-300 ease-linear hover:bg-black'
            >
              <Image
                src='/assets/img_placeholder/th-1/icon-instagram.svg'
                alt='icon-instagram'
                width='12'
                height='12'
                className='transition-all duration-300 ease-linear group-hover:brightness-0 group-hover:invert'
              />
            </Link>
          </div>
          {/* Footer Social */}
        </div>
      </div>
      {/* Footer Bottom */}
    </footer>
  );
} 