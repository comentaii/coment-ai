'use client';
import dynamic from 'next/dynamic';
import { RootProvidersProps } from './root-providers';

const DynamicRootProviders = dynamic(
  () => import('./root-providers').then(mod => mod.RootProviders),
  {
    ssr: false,
    loading: () => <div>Loading...</div>, // You can replace this with a proper skeleton loader
  }
);

export const ClientProviders = ({
  children,
  messages,
  locale,
}: RootProvidersProps) => {
  return (
    <DynamicRootProviders messages={messages} locale={locale}>
      {children}
    </DynamicRootProviders>
  );
};
