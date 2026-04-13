import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

export const metadata: Metadata = {
  title: 'eugui — Copy-paste component registry',
  description: 'A shadcn-style CLI for distributing React component libraries. No runtime. You own the code.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased font-sans">
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
