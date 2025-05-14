"use client"

import * as React from "react"
import Link from "next/link"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  children: React.ReactNode
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ href, children, className = "", ...props }, ref) => {
    const style = {
      background: "linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
      backgroundSize: "200% 100%",
      backgroundPosition: "0% 50%",
      transition: "background-position 0.5s ease",
    } as React.CSSProperties

    const buttonContent = (
      <button
        ref={ref}
        className={`px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl shadow-md text-white disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        style={style}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundPosition = "100% 50%"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundPosition = "0% 50%"
        }}
        {...props}
      >
        {children}
      </button>
    )

    if (href) {
      return (
        <Link href={href} className="inline-block">
          {buttonContent}
        </Link>
      )
    }

    return buttonContent
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton } 