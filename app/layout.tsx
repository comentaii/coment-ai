import "./globals.css";
import { cn } from '@/lib/utils';

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
          'min-h-screen bg-background font-inter antialiased'
        )}
      >
        {children}
      </body>
    </html>
  );
}
