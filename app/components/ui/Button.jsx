"use client"

import { useState } from "react"
import Link from "next/link"

export function Button({ children, href, onClick, className = "", size = "default", variant = "default" }) {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyles = "inline-flex justify-center items-center gap-2 font-bold font-['Inter'] leading-normal transition-all duration-300"
  
  const sizeStyles = {
    small: "px-5 py-1 text-base",
    default: "px-5 py-2 text-base",
    large: "px-6 py-3 text-lg",
  }

  const variantStyles = {
    default: "bg-gradient-to-r from-teal-400 via-yellow-400 to-orange-500 hover:from-teal-500 hover:via-yellow-500 hover:to-orange-600 text-white rounded-md border-none cursor-pointer",
    outlined: "border-2 border-stone-950 text-stone-950 hover:bg-stone-950 hover:text-white rounded-md",
    text: "text-stone-950 hover:bg-stone-950/10 rounded-md",
  }

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonStyles}
      >
        {children}
      </Link>
    )
  }

  return (
    <button 
      onClick={onClick} 
      className={buttonStyles}
    >
      {children}
    </button>
  )
}
