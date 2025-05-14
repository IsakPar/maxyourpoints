"use client"

import { ReactNode } from "react"

interface HeaderContentProps {
  title?: string
  description?: string
}

interface HeaderProps {
  headerContentProps?: HeaderContentProps
}

const HeaderContent: React.FC<HeaderContentProps> = ({
  title = "Unlock Your Travel Potential with MaxYourPoints",
  description = "Discover expert tips on maximizing your travel rewards, from airline points to hotel deals that offer incredible value. Learn how to strategically accumulate and utilize your rewards for the best possible experiences. Join our vibrant community of savvy travelers and start your journey towards smarter, more efficient travel today. Share your experiences, ask questions, and gain insights that will transform the way you explore the world!",
}) => {
  return (
    <div className="header-content self-stretch px-4 md:px-16 py-12 md:py-20 inline-flex flex-col md:flex-row justify-start items-start gap-8 md:gap-20 overflow-hidden bg-[#D1F1EB]">
      <div className="flex-1 inline-flex flex-col justify-start items-start">
        <div className="self-stretch justify-start text-stone-950 text-4xl md:text-6xl leading-tight md:leading-[67.20px]">
          {title}
        </div>
      </div>
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
        <div className="self-stretch justify-start text-stone-950 text-base md:text-lg font-bold font-['Inter'] leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  )
}

const Header: React.FC<HeaderProps> = ({ headerContentProps = {} }) => {
  return (
    <header className="header w-full flex flex-col">
      <div className="hero-image-container relative w-full max-w-[1440px] h-[300px] md:h-[663px] mx-auto overflow-hidden">
        {/* Aircraft landing image */}
        <img
          src="/aircraft-landing.jpg"
          alt="Aircraft landing with mountain backdrop and illuminated runway"
          className="w-full h-full object-cover"
        />
      </div>
      <HeaderContent {...headerContentProps} />
    </header>
  )
}

export default Header 