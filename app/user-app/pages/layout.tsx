import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DevTools } from '@/components/dev-tools'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CV to Website - Transform Your Resume',
  description: 'Transform your CV into a beautiful, professional website in minutes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen bg-background antialiased">
          {children}
        </main>
        <DevTools />
      </body>
    </html>
  )
} 