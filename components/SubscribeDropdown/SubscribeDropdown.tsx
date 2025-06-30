"use client"

import React, { useState } from "react"
import { X, Mail } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"

interface SubscribeDropdownProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string) => void
}

export const SubscribeDropdown: React.FC<SubscribeDropdownProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear any previous messages
    setMessage("")
    setMessageType("")
    
    if (!email) {
      setMessage("Please enter your email address")
      setMessageType("error")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address")
      setMessageType("error")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const responseData = await response.json()

      if (response.ok && responseData.success) {
        if (responseData.alreadySubscribed) {
          // User is already subscribed
          setMessage("You're already subscribed! Check your inbox for our latest updates. 📧")
          setMessageType("success")
          // Don't call onSuccess since they're already subscribed
          setTimeout(() => {
            onClose()
            setMessage("")
            setMessageType("")
          }, 3000)
        } else if (responseData.requiresConfirmation) {
          // User needs to confirm email
          setMessage("Success! Please confirm via the link in your email. 📬")
          setMessageType("info")
          setTimeout(() => {
            onClose()
            setMessage("")
            setMessageType("")
          }, 4000)
        } else {
          // New subscription success
          setMessage("Success! Please confirm via the link in your email. 📬")
          setMessageType("success")
          onSuccess(email)
          setTimeout(() => setEmail(""), 5000)
        }
      } else {
        // Handle API errors
        setMessage(responseData.error || "Failed to subscribe. Please try again later.")
        setMessageType("error")
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setMessage("Network error. Please check your connection and try again.")
      setMessageType("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-25" onClick={onClose}>
      <div 
        className="absolute right-4 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-[61]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 rounded-full p-1"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Get the latest travel tips and credit card strategies delivered to your inbox.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-500 text-gray-900"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              messageType === "success" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : messageType === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : messageType === "info"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}>
              {message}
            </div>
          )}
          
          <GradientButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </GradientButton>
        </form>
        
        <p className="text-xs text-gray-500 mt-4 text-center leading-relaxed">
          You can unsubscribe at any time by visiting{" "}
          <span className="text-emerald-600 font-medium">maxyourpoints.com/unsubscribe</span>
        </p>
      </div>
    </div>
  )
} 