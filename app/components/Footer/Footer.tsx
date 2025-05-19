"use client"

import * as React from "react"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Youtube, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { SubscriptionSuccess } from "@/components/blog/SubscriptionSuccess"

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address", {
        style: {
          background: "#FEF2F2",
          border: "1px solid #FEE2E2",
          color: "#991B1B",
        },
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address", {
        style: {
          background: "#FEF2F2",
          border: "1px solid #FEE2E2",
          color: "#991B1B",
        },
      })
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

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      setShowSuccess(true)
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.", {
        style: {
          background: "#FEF2F2",
          border: "1px solid #FEE2E2",
          color: "#991B1B",
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <footer className="bg-[#D1F1EB] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Max Your Points</h3>
              <p className="text-gray-600">
                Helping you maximize your travel rewards and experiences.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-emerald-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-gray-600 hover:text-emerald-600">
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-emerald-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="text-gray-600 hover:text-emerald-600">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-gray-600 hover:text-emerald-600">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="text-gray-600 hover:text-emerald-600">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Subscribe & Social */}
            <div className="space-y-6">
              {/* Subscribe Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Stay Updated</h3>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-black"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1.5 text-sm font-medium font-['Inter'] rounded-xl text-stone-950 hover:text-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      background: "white",
                      border: "2px solid transparent",
                      backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      transition: "all 0.5s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
                    }}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              </div>

              {/* Social Media Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Twitter size={20} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 transition-colors">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="text-sm text-gray-600 mb-6">
              <p>
                This website uses cookies to enhance your browsing experience and analyze site traffic. 
                By continuing to use this site, you consent to our use of cookies as described in our{' '}
                <Link href="/cookie-policy" className="text-emerald-600 hover:text-emerald-700 underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Max Your Points. All rights reserved.</p>
              <p className="text-gray-600">
                Built by{" "}
                <Link href="https://impdigital.services" className="text-emerald-600 hover:text-emerald-700 underline">
                  IMP Digital Services
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>

      <SubscriptionSuccess
        isVisible={showSuccess}
        email={email}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
}

export default Footer
