import "./globals.css";
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          poppins.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
