import { IBM_Plex_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { RootProviders } from '@/components/providers/root-providers';
import { VersionBadge } from '@/components/ui/version-badge';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const { locale } = params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${ibmPlexMono.variable} font-mono antialiased bg-white dark:bg-gray-900`}>
        <RootProviders messages={messages} locale={locale}>
          {children}
          <VersionBadge />
        </RootProviders>
      </body>
    </html>
  );
} 