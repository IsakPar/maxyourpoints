"use client"

import * as React from "react"
import AboutHero from "./AboutHero"
import AboutStory from "./AboutStory"
import { AboutTeam } from "./AboutTeam"
import { AboutBenefits } from "./AboutBenefits"
import Footer from "../components/Footer/Footer"
import CTASection from "../components/CTASection/CTASection"

export default function AboutPage() {
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