"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { GradientButton } from "@/components/ui/gradient-button"

interface SubscribeDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const SubscribeDropdown: React.FC<SubscribeDropdownProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSuccess(true)
    setEmail("")
    setIsSubmitting(false)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div 
        className="absolute right-4 top-16 w-80 bg-white rounded-xl shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {!isSuccess ? (
          <>
            <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Get the latest travel tips and credit card strategies delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <GradientButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </GradientButton>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-emerald-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600">
              You've successfully subscribed to our newsletter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 