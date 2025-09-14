import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // DM Sans - Sadece ana başlıklar (H1) ve vurucu sloganlar için
        'dm-sans': ['DM Sans', 'sans-serif'],
        // Inter - Tüm diğer metinler için (body, buttons, alt başlıklar)
        'inter': ['Inter', 'sans-serif'],
        // Fallback fonts
        sans: ['Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.2rem' }],
        'sm': ['0.875rem', { lineHeight: '1.4rem' }],
        'base': ['1rem', { lineHeight: '1.6rem' }],
        'lg': ['1.125rem', { lineHeight: '1.8rem' }],
        'xl': ['1.25rem', { lineHeight: '2rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.25rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4rem' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // --- Projeye Özel Yeni Renk Paleti ---
        brand: {
          // Ana Vurgu Renkleri (Koyu Yeşil Ana, Açık Yeşil İkincil)
          green: {
            DEFAULT: '#3A8C24', // Ana Vurgu Rengi (Koyu Yeşil) - Butonlar için
            hover: '#4CAF31',   // Hover Durumu (Biraz Daha Açık)
            light: '#6AD93F',   // İkincil Vurgu Rengi (Açık Yeşil)
          },
          // Arka Plan Renkleri
          background: {
            DEFAULT: '#F5F5F5', // Light Ana Arka Plan
            dark: '#1E1E1E',     // Dark Ana Arka Plan
          },
          // Kart/İkincil Arka Plan Renkleri
          card: {
            DEFAULT: '#FFFFFF', // Light Kartlar
            dark: '#2C2C2C',    // Dark Kartlar
          },
          // Metin Renkleri
          text: {
            primary: {
              DEFAULT: '#333333', // Light Birincil Metin
              dark: '#E0E0E0',    // Dark Birincil Metin
            },
            secondary: {
              DEFAULT: '#666666', // Light İkincil Metin
              dark: '#A0A0A0',    // Dark İkincil Metin
            },
          },
          // Kenarlık Renkleri
          border: {
            DEFAULT: '#E0E0E0', // Light Kenarlık
            dark: '#404040',    // Dark Kenarlık
          },
          // Durum Renkleri
          error: '#DC3545',
          success: '#28A745',
          warning: '#FFC107',
        },
        // --- Template Renk Paleti ---
        colorCodGray: '#191919',
        colorOrangyRed: '#FE330A',
        colorLinenRuffle: '#EFEAE3',
        colorViolet: '#321CA4',
        colorGreen: '#39FF14',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
