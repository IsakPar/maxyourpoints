"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for seems to have taken an unexpected flight. 
            Let's get you back on track!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              ✈️ Go Home
            </Button>
          </Link>
          
          <Link href="/blog">
            <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
              📖 Browse Articles
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
              💬 Contact Us
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If you believe this is an error, please <Link href="/contact" className="text-teal-600 hover:underline">contact us</Link>.</p>
        </div>
      </div>
    </div>
  )
} 