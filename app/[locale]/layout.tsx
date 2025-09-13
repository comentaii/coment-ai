import { getMessages, getLocale } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { Toaster } from '@/components/ui/sonner';
import { VersionBadge } from '@/components/ui/version-badge';
import { ClientProviders } from '@/components/providers/client-providers';

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children }: Omit<Props, 'params'>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClientProviders messages={messages} locale={locale}>
      <Toaster />
      {children}
      <VersionBadge />
      <SpeedInsights />
      <Analytics />
    </ClientProviders>
  );
}