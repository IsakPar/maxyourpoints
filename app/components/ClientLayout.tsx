"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  return <>{children}</>
} 