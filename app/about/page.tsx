"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Plane, CreditCard, Compass, Globe, Lightbulb, Check, Rocket, Zap, Brain, Settings, Building2, Palette, Target, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import CTASection from "@/components/CTASection/CTASection"
import ScrollReveal from "@/components/ui/scroll-reveal"

export default function AboutPage() {
  const [techDetailsExpanded, setTechDetailsExpanded] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 bg-gradient-to-br from-teal-50 to-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Animation - Globe with Flying Plane */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 via-teal-500 to-emerald-500 rounded-2xl shadow-2xl overflow-hidden relative">
                
                {/* Animated Globe and Plane */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    
                    {/* Globe SVG */}
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      <defs>
                        {/* Globe Gradient */}
                        <radialGradient id="globeGradient" cx="0.3" cy="0.3">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                          <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
                          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                        </radialGradient>
                        
                        {/* Grid Pattern */}
                        <pattern id="globeGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      
                      {/* Main Globe Circle */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="url(#globeGradient)"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                      />
                      
                      {/* Grid Lines */}
                      <circle cx="100" cy="100" r="80" fill="url(#globeGrid)" opacity="0.6"/>
                      
                      {/* Longitude Lines */}
                      <path d="M 100 20 Q 120 100 100 180 Q 80 100 100 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      <path d="M 100 20 Q 140 100 100 180 Q 60 100 100 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      
                      {/* Latitude Lines */}
                      <ellipse cx="100" cy="60" rx="60" ry="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      <ellipse cx="100" cy="140" rx="60" ry="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                      
                      {/* Continents (simplified shapes) */}
                      <path d="M 70 80 Q 80 75 90 80 Q 95 85 85 90 Q 75 85 70 80" fill="rgba(255,255,255,0.3)"/>
                      <path d="M 110 70 Q 125 65 135 70 Q 140 80 130 85 Q 115 80 110 70" fill="rgba(255,255,255,0.3)"/>
                      <path d="M 80 120 Q 90 115 100 120 Q 105 130 95 135 Q 85 130 80 120" fill="rgba(255,255,255,0.3)"/>
                    </svg>
                    
                    {/* Orbiting Plane */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                      <div className="relative w-full h-full">
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl">
                          ✈️
                        </div>
                      </div>
                    </div>
                    
                    {/* Second Plane (opposite direction, different speed) */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                      <div className="relative w-full h-full">
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xl opacity-60">
                          🛩️
                        </div>
                      </div>
                    </div>
                    
                    {/* Orbital Paths */}
                    <div className="absolute inset-0">
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        <circle 
                          cx="100" 
                          cy="100" 
                          r="95" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.1)" 
                          strokeWidth="1" 
                          strokeDasharray="5 5"
                          className="animate-pulse"
                        />
                        <circle 
                          cx="100" 
                          cy="100" 
                          r="105" 
                          fill="none" 
                          stroke="rgba(255,255,255,0.08)" 
                          strokeWidth="1" 
                          strokeDasharray="3 7"
                          className="animate-pulse"
                          style={{ animationDelay: '1s' }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Floating Points/Destinations */}
                <div className="absolute top-8 left-8 text-white/40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>📍</div>
                <div className="absolute top-12 right-16 text-white/30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>🏨</div>
                <div className="absolute bottom-16 left-16 text-white/40 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>🎯</div>
                <div className="absolute bottom-8 right-8 text-white/30 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>💳</div>
                
                {/* Bottom Text */}
                <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                  <div className="text-sm font-medium opacity-90">Navigate the World of Points & Miles</div>
                </div>
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-teal-600/5 rounded-2xl" />
              </div>
            </div>
            
            {/* Hero Text */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-stone-950 mb-6">
                  The People Behind the Points
                </h1>
                <p className="text-xl text-stone-700 leading-relaxed">
                  Real travelers. Real strategies. Real value.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition-all duration-300"
                onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Meet the Team
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Max Your Points Story Section */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-teal-200 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 rounded-full">
                    <BookOpen size={48} className="text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-stone-950 mb-4">The Max Your Points Story</h3>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                  How a simple passion for travel turned into something much bigger than I ever imagined.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6 text-lg text-stone-700 leading-relaxed">
                <p className="text-xl font-medium text-stone-900 text-center">
                  It started with a simple idea: share my love for travel and points with others.
                </p>
                
                <p>
                  Like many of you, I was fascinated by the world of travel rewards. The thrill of finding that perfect redemption, the satisfaction of elite status perks, the excitement of planning amazing trips for a fraction of the cost. I wanted to share these experiences and help others navigate this complex but rewarding world.
                </p>
                
                <p>
                  So I sat down to build what I thought would be a simple travel blog. Just a place to write about flights, hotels, and strategies. But as I started building, something unexpected happened...
                </p>
                
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border-l-4 border-teal-500">
                  <p className="text-xl font-semibold text-teal-900">
                    I realized that to truly serve the travel community, I needed to build something that didn't exist yet.
                  </p>
                </div>
                
                <p>
                  The existing platforms weren't quite right. They were either too basic, missing key features, or didn't understand what serious travel enthusiasts actually needed. I found myself saying "I wish there was a way to..." over and over again.
                </p>
                
                <p>
                  That's when it hit me: <strong>I had to build it myself.</strong> What started as a weekend project turned into nights and weekends of passionate development. Every feature was crafted with real travelers in mind, every optimization designed to make your experience better.
                </p>
                
                <p className="text-center text-lg font-medium text-stone-900 bg-stone-100 p-4 rounded-lg">
                  Curious about the technical details? Check out our comprehensive 
                  <button 
                    onClick={() => setTechDetailsExpanded(true)} 
                    className="text-teal-600 hover:text-teal-800 font-semibold underline ml-1"
                  >
                    Technical Deep Dive
                  </button> below.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Details (Expandable) */}
      <section className="py-16 px-4 md:px-8 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-teal-200 shadow-xl">
            <CardContent className="p-8">
              <button
                onClick={() => setTechDetailsExpanded(!techDetailsExpanded)}
                className="w-full text-left space-y-4 hover:opacity-80 transition-opacity duration-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-xl border border-teal-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-bold text-stone-950">🔧 Technical Deep Dive</h4>
                  {techDetailsExpanded ? 
                    <ChevronUp className="w-6 h-6 text-teal-600" /> : 
                    <ChevronDown className="w-6 h-6 text-teal-600" />
                  }
                </div>
                <p className="text-stone-600">
                  Dive into the architecture, custom features, and engineering decisions behind Max Your Points
                </p>
              </button>
              
              {techDetailsExpanded && (
                <div className="mt-8 pt-8 border-t border-stone-200 space-y-12">
                  {/* Personal Introduction */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-blue-200">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg mb-6">
                        <Plane className="w-6 h-6" />
                        <span className="text-xl font-bold">From Passion Project to Engineering Showcase</span>
                        <Plane className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-6 text-lg text-stone-700 leading-relaxed">
                      <p className="text-xl font-medium text-stone-900">
                        Hey there! Let me tell you the real story behind Max Your Points...
                      </p>
                      
                      <p>
                        This whole thing started as a tiny side project. I just wanted a simple place to write about my love for flying—sharing the excitement of finding sweet spot redemptions, the thrill of elite status perks, and those magical moments when everything clicks perfectly for an amazing trip.
                      </p>
                      
                      <p>
                        But then something happened during the build process. What was supposed to be a basic blog quickly became an <strong>every-free-second maniac build</strong>. Evenings, weekends, lunch breaks—I was constantly thinking about the next feature, the next optimization, the next way to make this platform better.
                      </p>
                      
                      <p className="text-xl font-semibold text-teal-800 bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
                        Is it probably way over the top for a travel blog? <em>Absolutely.</em> Am I incredibly proud of what we've built? <em>You bet I am.</em>
                      </p>
                      
                      <p>
                        What you're looking at isn't just a website—it's a full-scale engineering showcase that combines my passion for travel with my obsession for building things the right way. Every line of code, every architectural decision, every performance optimization was driven by one question: "How can we make this the absolute best tool for fellow travel enthusiasts?"
                      </p>
                    </div>
                  </div>

                  {/* Technical Deep Dive Header */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full shadow-lg mb-6">
                      <Brain className="w-6 h-6" />
                      <span className="text-xl font-bold">The Technical Deep Dive</span>
                      <Brain className="w-6 h-6" />
                    </div>
                    <p className="text-2xl leading-relaxed text-stone-800 max-w-4xl mx-auto">
                      Here's what makes this platform special—and probably completely overkill for most travel blogs.
                    </p>
                  </div>

                  {/* Custom Engines Showcase */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white shadow-2xl">
                    <div className="text-center mb-10">
                      <h4 className="text-3xl font-bold mb-4">🚀 Custom-Built Engines & Systems</h4>
                      <p className="text-slate-300 text-xl max-w-3xl mx-auto">
                        When existing solutions aren't good enough, you build your own. Here are the engines powering Max Your Points.
                      </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* SEO Engine */}
                      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-green-500 p-3 rounded-xl">
                            <Target size={32} className="text-white" />
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-green-400">Advanced SEO Engine</h5>
                            <p className="text-slate-400">Real-time content optimization</p>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                          I built a custom SEO analyzer that goes way beyond basic keyword density. It analyzes E-A-T compliance (critical for YMYL content like travel/finance), performs semantic keyword analysis, checks readability scores, and even validates content against Google's quality guidelines in real-time.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Flesch-Kincaid readability analysis</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>YMYL (Your Money Your Life) compliance scoring</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Semantic keyword density optimization</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Google E-A-T (Expertise, Authority, Trust) validation</span>
                          </div>
                        </div>
                      </div>

                      {/* pgVector Article Matcher */}
                      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-purple-500 p-3 rounded-xl">
                            <Brain size={32} className="text-white" />
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-purple-400">pgVector Article Matcher</h5>
                            <p className="text-slate-400">AI-powered content discovery</p>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                          Using PostgreSQL's pgvector extension, I created an intelligent article recommendation system that understands semantic similarity. It doesn't just match keywords—it understands context, meaning, and user intent to surface the most relevant content.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Vector embeddings for semantic search</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Contextual content recommendations</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>User behavior pattern analysis</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>Dynamic similarity scoring algorithms</span>
                          </div>
                        </div>
                      </div>

                      {/* Semantic Processing Engine */}
                      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-blue-500 p-3 rounded-xl">
                            <Zap size={32} className="text-white" />
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-blue-400">Semantic Processing Engine</h5>
                            <p className="text-slate-400">Intelligent content analysis</p>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                          This engine processes content at a deep semantic level, understanding travel terminology, extracting entities like airlines and hotels, analyzing sentiment, and automatically categorizing content. It's like having an AI travel expert review every piece of content.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Travel-specific entity extraction</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Sentiment analysis and optimization</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Automatic content categorization</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Semantic HTML structure generation</span>
                          </div>
                        </div>
                      </div>

                      {/* Custom CMS with Email Integration */}
                      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-orange-500 p-3 rounded-xl">
                            <Settings size={32} className="text-white" />
                          </div>
                          <div>
                            <h5 className="text-2xl font-bold text-orange-400">Custom CMS Platform</h5>
                            <p className="text-slate-400">Complete content ecosystem</p>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-6 leading-relaxed">
                          Forget WordPress or generic CMS solutions. I built a complete content management system from scratch, specifically designed for travel content. It includes article creation with rich media support, user management, email integration, newsletter systems, and advanced analytics.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Rich WYSIWYG editor with travel-specific fields</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Complete user management & role-based access</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Email integration with newsletter campaigns</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span>Media management with automatic optimization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Deep Dive */}
                  <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-10 text-white shadow-2xl">
                    <div className="text-center mb-10">
                      <h4 className="text-3xl font-bold mb-4">🏗️ Technical Architecture</h4>
                      <p className="text-indigo-200 text-xl max-w-3xl mx-auto">
                        The technical foundation that makes all this magic possible.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-indigo-800/30 p-6 rounded-xl border border-indigo-700">
                        <h5 className="text-2xl font-bold text-indigo-300 mb-4">⚡ Frontend Excellence</h5>
                        <div className="space-y-4 text-indigo-100">
                          <p><strong>Next.js 15.2.4 + React 19:</strong> Server components for zero client-side JavaScript on initial load</p>
                          <p><strong>TypeScript Strict Mode:</strong> 100% type coverage with custom definitions</p>
                          <p><strong>Tailwind CSS + shadcn/ui:</strong> Consistent, beautiful design system</p>
                          <p><strong>Advanced Caching:</strong> Multi-layer strategy with ISR and edge caching</p>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-800/30 p-6 rounded-xl border border-indigo-700">
                        <h5 className="text-2xl font-bold text-indigo-300 mb-4">🛡️ Backend Power</h5>
                        <div className="space-y-4 text-indigo-100">
                          <p><strong>Supabase + PostgreSQL:</strong> Edge functions with global deployment</p>
                          <p><strong>Row Level Security:</strong> Enterprise-grade data protection</p>
                          <p><strong>pgVector Integration:</strong> Native vector operations for AI features</p>
                          <p><strong>Real-time Subscriptions:</strong> Live updates across the platform</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance & Analytics */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-10 rounded-2xl border border-emerald-200 shadow-xl">
                    <div className="text-center mb-10">
                      <h4 className="text-3xl font-bold text-emerald-900 mb-4">📊 Performance & Features</h4>
                      <p className="text-emerald-700 text-xl max-w-3xl mx-auto">
                        The features and optimizations that deliver an exceptional user experience.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-emerald-200">
                        <div className="text-4xl mb-4">⚡</div>
                        <h6 className="font-bold text-stone-900 mb-2">Lightning Fast</h6>
                        <p className="text-stone-600 text-sm mb-4">Sub-second page loads</p>
                        <div className="space-y-2 text-sm text-stone-600">
                          <div>🚀 Next.js optimization</div>
                          <div>📦 Bundle splitting</div>
                          <div>🖼️ Image optimization</div>
                          <div>⚡ Edge caching</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-emerald-200">
                        <div className="text-4xl mb-4">🔒</div>
                        <h6 className="font-bold text-stone-900 mb-2">Security First</h6>
                        <p className="text-stone-600 text-sm mb-4">Enterprise-grade protection</p>
                        <div className="space-y-2 text-sm text-stone-600">
                          <div>✅ OWASP compliance</div>
                          <div>✅ End-to-end encryption</div>
                          <div>✅ Rate limiting & DDoS protection</div>
                          <div>✅ Audit trails & monitoring</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-emerald-200">
                        <div className="text-4xl mb-4">📈</div>
                        <h6 className="font-bold text-stone-900 mb-2">Analytics & Insights</h6>
                        <p className="text-stone-600 text-sm mb-4">Data-driven optimization</p>
                        <div className="space-y-2 text-sm text-stone-600">
                          <div>📊 Custom analytics dashboard</div>
                          <div>🎯 User behavior tracking</div>
                          <div>📝 Content performance metrics</div>
                          <div>🔍 SEO monitoring & alerts</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-emerald-200">
                        <div className="text-4xl mb-4">🎨</div>
                        <h6 className="font-bold text-stone-900 mb-2">Design Excellence</h6>
                        <p className="text-stone-600 text-sm mb-4">Beautiful & accessible</p>
                        <div className="space-y-2 text-sm text-stone-600">
                          <div>🎯 WCAG 2.1 AA compliance</div>
                          <div>📱 Mobile-first design</div>
                          <div>✨ Smooth animations</div>
                          <div>🌙 Dark/light mode ready</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Reflection */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-2xl border border-amber-200 shadow-xl">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full shadow-lg mb-6">
                        <Lightbulb className="w-6 h-6" />
                        <span className="text-xl font-bold">Why Go This Deep?</span>
                        <Lightbulb className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-6 text-lg text-stone-700 leading-relaxed">
                      <p className="text-2xl font-semibold text-stone-900 text-center mb-8">
                        Because travel deserves better tools, and travelers deserve better experiences.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h6 className="text-xl font-bold text-amber-800">For Fellow Travel Enthusiasts</h6>
                          <p>
                            When you're researching credit card strategies or planning a complex multi-city trip, you need information that loads fast, is easy to find, and actually helps you make better decisions. Every optimization here makes your experience smoother.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <h6 className="text-xl font-bold text-amber-800">For the Engineering Community</h6>
                          <p>
                            This platform demonstrates what's possible when you combine modern web technologies with domain expertise. It's a full-stack showcase of Next.js 15, advanced PostgreSQL features, AI integration, and performance optimization.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-8 rounded-xl border border-amber-200 mt-8">
                        <div className="text-center">
                          <p className="text-xl font-medium text-stone-900 mb-4">
                            Have questions about our technical approach? Want to discuss travel optimization strategies? Or curious about how we built something this sophisticated?
                          </p>
                          <p className="text-lg text-stone-700 mb-6">
                            I love talking shop about both travel rewards and engineering. Don't hesitate to reach out!
                          </p>
                          <a 
                            href="mailto:isak@maxyourpoints.com?subject=Question about Max Your Points&body=Hi Isak,%0D%0A%0D%0AI have a question about..." 
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            📧 Get in Touch - isak@maxyourpoints.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-950 mb-12">The Max Your Points Commitment</h2>
          <div className="prose prose-lg mx-auto text-stone-700 leading-relaxed font-serif">
            <p className="text-xl mb-8">
              Travel should be smarter, more accessible, and more rewarding. What started as a passion project between two travel enthusiasts has grown into a comprehensive resource for maximizing your travel rewards and experiences.
            </p>
            <p className="text-lg">
              We believe that with the right knowledge and strategies, anyone can unlock incredible travel opportunities without breaking the bank. Our mission is to demystify the complex world of points, miles, and travel rewards, making luxury travel accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-4 md:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-stone-950 mb-16">What We Do</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <div className="text-4xl">✈️</div>,
                title: "Flight Hacks",
                description: "Fly business for less with smart routing, sweet spots, and mileage tricks."
              },
              {
                icon: <CreditCard size={48} className="text-blue-600" />,
                title: "Card Strategies",
                description: "Pick the best cards, earn faster, and unlock powerful rewards."
              },
              {
                icon: <div className="text-4xl">🥂</div>,
                title: "Elite Status",
                description: "Get lounges, upgrades, and perks—without spending a fortune."
              },
              {
                icon: <Globe size={48} className="text-emerald-600" />,
                title: "Travel Smarter",
                description: "Turn points into unforgettable trips across the globe."
              }
            ].map((service, index) => (
              <ScrollReveal key={index} delay={index * 150} direction="up">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center group">
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-stone-950 mb-4">{service.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team-section" className="py-24 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-stone-950 mb-16">Meet the Team</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Isak - Founder & CEO */}
            <ScrollReveal delay={0} direction="left">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl shadow-xl border border-teal-200 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-stone-950 mb-2">Isak Parildar</h3>
                    <p className="text-teal-700 font-semibold">Founder & CEO</p>
                  </div>
                  
                  {/* Elite Status Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-300">
                      SkyTeam Elite
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border border-green-300">
                      OneWorld Elite
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border border-amber-300">
                      Multiple Hotel Elite
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4 text-stone-700">
                  <p className="leading-relaxed">
                    <strong>Elite traveler across multiple alliances and tech architect.</strong> Isak currently holds elite status in both SkyTeam and OneWorld, and maintained Star Alliance Gold for most of his teens until COVID disrupted the travel landscape. This cross-alliance experience provides unique insights into maximizing benefits across different loyalty ecosystems.
                  </p>
                  <p className="leading-relaxed">
                    As the technical mastermind behind Max Your Points, he's architected every component from the ground up using cutting-edge technologies: Next.js 15 with React Server Components, PostgreSQL with pgVector for AI-powered content matching, custom SEO analysis engines, real-time analytics systems, and enterprise-grade security implementations. The platform runs on a modern tech stack with edge computing, advanced caching strategies, and microservice architecture.
                  </p>
                  <p className="leading-relaxed">
                    Beyond the travel expertise, Isak brings years of full-stack development experience, specializing in performance optimization, scalable system design, and creating sophisticated tools that make complex travel rewards strategies accessible to everyone. This platform showcases his approach to engineering: thoughtful, thorough, and uncompromising on quality.
                  </p>
                  <p className="leading-relaxed">
                    The intersection of travel optimization and cutting-edge technology is where Isak thrives, continuously pushing the boundaries of what a travel platform can achieve through innovative engineering solutions.
                  </p>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-teal-200">
                  <div className="text-sm text-stone-600">
                    <strong>Specializes in:</strong> Multi-alliance elite status strategies, modern web architecture (Next.js, React, TypeScript), AI/ML integration, custom CMS development, performance optimization, and creating tools that democratize complex travel rewards knowledge.
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Nigel Evans - Travel Expert */}
            <ScrollReveal delay={200} direction="right">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-xl border border-amber-200 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-stone-950 mb-2">Nigel Evans</h3>
                    <p className="text-amber-700 font-semibold">Travel Expert & Strategy Advisor</p>
                  </div>
                  
                  {/* Elite Status Badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border border-blue-300">
                      SkyTeam Platinum
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border border-amber-300">
                      Star Alliance Gold
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border border-green-300">
                      OneWorld Lifetime Gold
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4 text-stone-700">
                  <p className="leading-relaxed">
                    <strong>Seasoned traveller over many decades, including flying to Australia 3 times in 6 months business class for less than £6,000.</strong> Nigel is using his experience to navigate complex loyalty programmes and maximising travel value across airlines, hotels and credit cards.
                  </p>
                  <p className="leading-relaxed">
                    Part in thanks to Status matches Nigel holds Platinum in SkyTeam, Gold in Star Alliance, and life time gold in One World.
                  </p>
                  <p className="leading-relaxed">
                    Nigel's real world experience in traveling to over half the world and his thorough approach to bookings ensuring recognition and values will provide Max Your points into grit tips and hacks that will deliver tried and tested results at a fraction of the cost.
                  </p>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-l-4 border-amber-500">
                    <p className="italic text-amber-800 leading-relaxed">
                      "I've turned my hobby into my job. I have enjoyed finding cut price business class fares, and flying through priority security into great airline lounges whilst amassing recognition at every stage. I will now share the tricks and hacks with you at Max your points"
                    </p>
                    <p className="text-right mt-2 font-semibold text-amber-900">- Nigel Evans</p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-amber-200">
                  <div className="text-sm text-stone-600">
                    <strong>Specializes in:</strong> Status matches across alliance programs, business class deals, loyalty program optimization, and real-world tested strategies for maximizing travel value.
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-teal-50">
        <CTASection />
      </div>

      {/* Mission & Values */}
      <section className="py-24 px-4 md:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Side - Values */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-stone-950 mb-8">Our Values</h2>
                <p className="text-xl text-stone-700 leading-relaxed mb-12">
                  Everything we do is guided by these core principles that shape how we create content, interact with our community, and build our platform.
                </p>
              </div>
              
              <div className="space-y-8">
                <ScrollReveal delay={0} direction="left">
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <Compass size={32} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-950 mb-2">Travel is transformative</p>
                      <p className="text-stone-700">
                        We believe travel has the power to broaden perspectives, connect cultures, and create lasting memories. Our goal is to make these transformative experiences accessible to more people through smart rewards strategies.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={200} direction="left">
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb size={32} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-950 mb-2">Knowledge is power</p>
                      <p className="text-stone-700">
                        With the right insights, anyone can turn everyday spending into extraordinary journeys. We exist to help you navigate the complex world of rewards, loyalty programs, and elite status—with clarity and confidence.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={400} direction="left">
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <Compass size={32} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-950 mb-2">Transparency matters</p>
                      <p className="text-stone-700">
                        Our reviews are unbiased, our recommendations are experience-based, and we never promote a product we wouldn't use ourselves.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Side - Mission Statement */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-xl border border-teal-200">
                <h3 className="text-2xl font-bold text-stone-950 mb-6">Our Mission</h3>
                <p className="text-lg text-stone-700 leading-relaxed">
                  Whether you're planning a dream trip, chasing lifetime elite status, or just trying to get more value from your credit card, Max Your Points is here to help you travel better, smarter, and farther.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    icon: <Check size={28} className="text-green-600" />,
                    title: "Transparency in reviews",
                    description: "Unbiased, experience-based recommendations"
                  },
                  {
                    icon: <Compass size={28} className="text-blue-600" />, 
                    title: "Real-world travel advice",
                    description: "Practical strategies that actually work"
                  },
                  {
                    icon: <Globe size={28} className="text-emerald-600" />,
                    title: "Travel as a force for good",
                    description: "Connecting cultures and communities"
                  }
                ].map((belief, index) => (
                  <ScrollReveal key={index} delay={index * 150} direction="right">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">{belief.icon}</div>
                      <div>
                        <h4 className="font-semibold text-stone-950 mb-1">{belief.title}</h4>
                        <p className="text-stone-600">{belief.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 