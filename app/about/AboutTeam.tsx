"use client"

import * as React from "react"

export function AboutTeam() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Travel Rewards Expert",
      description: "With over 10 years of experience in credit card rewards and travel hacking, Sarah helps members optimize their points and miles for maximum value.",
      image: "IMG"
    },
    {
      name: "Michael Chen",
      role: "Credit Card Strategist",
      description: "Michael specializes in credit card optimization strategies and has helped thousands of members build their perfect points-earning setup.",
      image: "IMG"
    },
    {
      name: "Emma Rodriguez",
      role: "Travel Experience Curator",
      description: "Emma focuses on creating unforgettable travel experiences, from luxury hotel stays to unique local adventures, all while maximizing points value.",
      image: "IMG"
    }
  ]

  return (
    <section className="py-24 bg-emerald-50">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-gray-600">
              Meet the passionate individuals dedicated to helping you maximize your travel rewards and experiences.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:w-2/3">
            <div className="space-y-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-medium transition-all duration-300 hover:bg-gray-300">
                    {member.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1 transition-colors duration-300 hover:text-emerald-600">{member.name}</h3>
                    <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 