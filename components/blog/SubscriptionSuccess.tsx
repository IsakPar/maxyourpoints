"use client"

import * as React from "react"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SubscriptionSuccessProps {
  isVisible: boolean
  email: string
  onClose: () => void
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-3 border border-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-stone-600">
              Subscribed! Check your email for confirmation.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 