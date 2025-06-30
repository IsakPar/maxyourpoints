"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, MessageCircle, MapPin, Twitter, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Message launched! 🚀 We\'ll get back to you soon!')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Oops! Something went wrong. Give it another shot! 🔄')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-orange-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-pulse">
            Let's Chat! ✈️💬
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto leading-relaxed">
            Got questions? Found an epic deal? Want to rant about airline food? 
            <br />
            <span className="font-bold text-yellow-300">Good or bad, whatever it is - please get in touch with us!</span>
          </p>
          <div className="mt-8 text-lg opacity-80">
            We're real humans who actually reply! 🤓
          </div>
        </div>
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">✈️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce delay-1000">🎯</div>
      </div>

      {/* Main Content with Better Spacing */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-4 border-teal-500 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageCircle size={24} />
                  Drop us a line! 📝
                </CardTitle>
                <p className="opacity-90">We'll get back to you as soon as we can ⚡</p>
              </CardHeader>
              <CardContent className="p-8">
                {isSuccess ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4 animate-bounce" />
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Message Launched! 🚀</h3>
                    <p className="text-gray-600 mb-6">
                      Your message is in our inbox and we'll get back to you as soon as we can! Thanks for reaching out! 🎉
                    </p>
                    <Button 
                      onClick={() => setIsSuccess(false)}
                      className="bg-teal-600 hover:bg-teal-700 rounded-2xl hover:scale-105 transition-transform"
                    >
                      Send Another One! 📨
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your awesome name"
                          className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@somewhere.com"
                          className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject" className="text-gray-700 font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's cooking? 🍳"
                        className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-gray-700 font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Spill the tea! Tell us everything... ☕"
                        rows={6}
                        className="mt-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none rounded-xl"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 text-lg font-medium rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <Mail size={20} />
                  Get In Touch! 📬
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl">
                  <Mail size={20} className="text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Slide into our inbox</p>
                    <a 
                      href="mailto:hello@maxyourpoints.com" 
                      className="text-teal-600 hover:text-teal-700 transition-colors font-semibold"
                    >
                      hello@maxyourpoints.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl">
                  <MessageCircle size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Response Speed</p>
                    <p className="text-gray-600">We'll get back to you as soon as we can! ⚡</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl text-gray-800">Hang Out With Us! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Join the fun and stay in the loop with epic travel deals! 🌍
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://x.com/max_your_points"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group transform hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                        <Twitter size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Follow us on X! 🚀</p>
                        <p className="text-sm text-gray-600 font-mono">@max_your_points</p>
                      </div>
                    </a>
                    
                    <a
                      href="mailto:hello@maxyourpoints.com"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl hover:from-teal-100 hover:to-emerald-100 transition-all duration-300 group transform hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                        <Mail size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Direct email line 📧</p>
                        <p className="text-sm text-gray-600">hello@maxyourpoints.com</p>
                      </div>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  )
} 