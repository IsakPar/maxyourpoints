import "./globals.css"
import type React from "react"
import Navbar from "./components/Navbar/Navbar"
import { Inter } from "next/font/google"
import ClientLayout from "./components/ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};
