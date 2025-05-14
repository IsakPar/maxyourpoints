"use client"

import * as React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-stone-950 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-stone-600 mb-8">
          Oops! The page you're looking for seems to have taken a detour. Let's get you back on track.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-base font-medium text-white rounded-lg shadow-md"
          style={{
            background: "linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
            backgroundSize: "200% 100%",
            backgroundPosition: "0% 50%",
            transition: "background-position 0.5s ease",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundPosition = "100% 50%"
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundPosition = "0% 50%"
          }}
        >
          Return Home
        </Link>
      </div>
    </main>
  )
} 