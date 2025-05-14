"use client"

import * as React from "react"
import AboutHero from "@/app/about/AboutHero"
import AboutStory from "@/app/about/AboutStory"
import { AboutTeam } from "@/app/about/AboutTeam"
import { AboutBenefits } from "@/app/about/AboutBenefits"
import Footer from "@/app/components/Footer/Footer"
import CTASection from "@/app/components/CTASection/CTASection"

export default function Page() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutTeam />
      <CTASection />
      <AboutBenefits />
      <Footer />
    </main>
  )
} 