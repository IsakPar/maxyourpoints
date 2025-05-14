"use client"

import React from "react"
import AboutHero from "./AboutHero"
import AboutStory from "./AboutStory"
import { AboutTeam } from "./AboutTeam"
import Footer from "@/components/Footer/Footer"
import CTASection from "@/components/CTASection/CTASection"
import { AboutBenefits } from "./AboutBenefits"

export default function Page() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutTeam />
      <div className="bg-teal-50">
        <CTASection />
      </div>
      <AboutBenefits />
    </main>
  )
} 