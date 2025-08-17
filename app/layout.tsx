import './globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      {children}
    </NuqsAdapter>
  )
}