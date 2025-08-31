import { IBM_Plex_Mono } from 'next/font/google';
import { getMessages, getLocale } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { VersionBadge } from '@/components/ui/version-badge';
import { ClientProviders } from '@/components/providers/client-providers';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
});

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children }: Omit<Props, 'params'>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
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
          ibmPlexMono.variable
        )}
      >
        <ClientProviders messages={messages} locale={locale}>
          <Toaster />
          {children}
          <VersionBadge />
          <SpeedInsights />
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
} 