'use client';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { RootProvidersProps } from './root-providers';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const DynamicRootProviders = dynamic(
  () => import('./root-providers').then(mod => mod.RootProviders),
  {
    ssr: false,
    loading: () => <FullPageLoader />,
  }
);

export const ClientProviders = ({
  children,
  messages,
  locale,
}: RootProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DynamicRootProviders messages={messages} locale={locale}>
        {children}
      </DynamicRootProviders>
    </ThemeProvider>
  );
};
