"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConfirmationBanner() {
  const searchParams = useSearchParams()
  const [showBanner, setShowBanner] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState('')

  useEffect(() => {
    const confirmed = searchParams.get('confirmed')
    const email = searchParams.get('email')
    
    if (confirmed === 'true' && email) {
      setConfirmedEmail(decodeURIComponent(email))
      setShowBanner(true)
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowBanner(false)
      }, 8000)
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!showBanner) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4">
      <Card className="bg-green-50 border-green-200 shadow-lg animate-in slide-in-from-top-4 duration-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Email Confirmed! 🎉</h3>
                <p className="text-sm text-green-700 mt-1">
                  Welcome to Max Your Points, {confirmedEmail.split('@')[0]}! You'll receive our weekly newsletter with travel tips and deals.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBanner(false)}
              className="text-green-600 hover:text-green-800 p-1 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 