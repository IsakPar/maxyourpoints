"use client"

import { usePathname } from "next/navigation"
import CTASection from "./CTASection/CTASection"
import Footer from "./Footer/Footer"

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isLegal = pathname === "/legal"

  return (
    <>
      {children}
      {!isLegal && <CTASection />}
      {!isLegal && <Footer />}
    </>
  )
} 