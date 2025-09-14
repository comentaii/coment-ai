'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

export function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header
      className='site-header site-header--absolute is--white py-4 lg:py-6'
      id='sticky-menu'
    >
      <div className='global-container'>
        <div className='flex items-center justify-between gap-x-8'>
          {/* Header Logo */}
          <Link href='/' className='inline-block'>
            <Image
              src='/logo-light.png'
              alt='CodileAI Logo'
              width={150}
              height={50}
              className='h-10 w-auto lg:h-12'
            />
          </Link>
          {/* Header Logo */}
          
          {/* Header Navigation */}
          <nav className={`menu-block-wrapper ${mobileMenu ? 'active' : ''}`}>
            <div className='menu-overlay' onClick={() => setMobileMenu(false)}></div>
            <nav className='menu-block' id='append-menu-header'>
              <div className='mobile-menu-head'>
                <div className='go-back'>
                  <i className='fa-solid fa-angle-left'></i>
                </div>
                <div className='current-menu-title'></div>
                <div className='mobile-menu-close' onClick={() => setMobileMenu(false)}>
                  &times;
                </div>
              </div>
              <ul className='site-menu-main'>
                <li className='nav-item'>
                  <Link href='/' className='nav-link-item'>
                    Ana Sayfa
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='/#features' className='nav-link-item'>
                    Özellikler
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='/#how-it-works' className='nav-link-item'>
                    Nasıl Çalışır
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='/#pricing' className='nav-link-item'>
                    Fiyatlandırma
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link href='/#contact' className='nav-link-item'>
                    İletişim
                  </Link>
                </li>
              </ul>
            </nav>
          </nav>
          {/* Header Navigation */}
          
          {/* Header User Event */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            
            <Link
              href='/tr/auth/signin'
              className='button hidden rounded-[50px] border-[#7F8995] bg-transparent px-6 py-3 text-sm font-medium text-black dark:text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'
            >
              Giriş Yap
            </Link>
            <Link
              href='/tr/auth/signup'
              className='button hidden rounded-[50px] border-black bg-black px-6 py-3 text-sm font-medium text-white after:bg-colorOrangyRed hover:border-colorOrangyRed hover:text-white lg:inline-block'
            >
              Ücretsiz Başla
            </Link>
            {/* Responsive Off-canvas Menu Button */}
            <div className='block lg:hidden'>
              <button
                onClick={() => setMobileMenu(true)}
                className='mobile-menu-trigger is-black'
              >
                <span />
              </button>
            </div>
          </div>
          {/* Header User Event */}
        </div>
      </div>
    </header>
  );
}