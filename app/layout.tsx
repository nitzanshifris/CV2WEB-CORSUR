import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CV2Web - יצירת אתר קורות חיים",
  description: "צור אתר קורות חיים אישי בקלות",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
} 