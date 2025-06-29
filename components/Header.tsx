import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { label: "Airline Deals", href: "/blog/categories/airlines-and-aviation" },
  { label: "Credit Insights", href: "/blog/categories/credit-cards-and-points" },
  { label: "Hotel Reviews", href: "/blog/categories/hotels-and-trip-reports" },
  { label: "Travel Tips", href: "/blog/categories/travel-hacks-and-deals" },
]

const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#D1F1EB]">
      {/* Hero Image Optimized for Performance - Fixed Height */}
      <div className="w-full relative h-[400px] md:h-[480px] bg-[#D1F1EB] overflow-hidden">
        <Image
          src="/aircraft-landing.jpg"
          alt="Aircraft landing with mountains in background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT//2Q=="
          data-priority="high"
          fetchPriority="high"
        />
      </div>
      {/* Content Section - Optimized Layout */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 bg-[#D1F1EB]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 font-sans text-left leading-tight">
              Unlock Your Travel Potential with MaxYourPoints
            </h1>
            <p className="text-lg md:text-xl text-stone-700 mb-4 font-sans text-left leading-relaxed">
              Discover how to turn points into possibilities — with expert tips on flights, hotels, and credit card rewards.
            </p>
          </div>
          <div>
            <ul className="space-y-4 text-stone-800 text-base md:text-lg font-sans">
              <li>• Learn how to optimize your travel rewards</li>
              <li>• Join a savvy community of points pros</li>
              <li>• Travel further, better, and more affordably</li>
              <li>• Get insider insights on airlines, hotels, and travel hacks</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 