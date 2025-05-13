"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import PropTypes from "prop-types"

const OutlinedGradientButton = ({ href, children }) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg text-stone-950 hover:text-orange-500"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

const BlogCarousel = ({
  title = "Latest from Our Blog",
  subtitle = "Discover our most recent insights and travel tips",
  posts = [],
  postsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  className = "",
  autoplay = false,
  autoplayDelay = 5000,
  theme = "light", // 'light', 'dark', 'teal'
}) => {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const carouselRef = useRef(null)
  const autoplayTimerRef = useRef(null)

  // Default blog posts if none are provided
  const defaultPosts = [
    {
      id: 1,
      title: "Maximize Your Airline Points",
      excerpt:
        "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use.",
      category: "Airline",
      readTime: "5 min read",
      image: "/placeholder.svg?key=ghetz",
      slug: "/blog/maximize-airline-points",
      date: "May 10, 2023",
    },
    {
      id: 2,
      title: "Best Credit Cards for Travel",
      excerpt:
        "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers. Compare sign-up bonuses and earning rates.",
      category: "Credit",
      readTime: "7 min read",
      image: "/placeholder.svg?key=i1lbq",
      slug: "/blog/best-credit-cards-travel",
      date: "April 28, 2023",
    },
    {
      id: 3,
      title: "Top Hotels for Budget Travelers",
      excerpt:
        "Find out how to book luxury accommodations without breaking the bank using points, promotions, and insider strategies. Learn which hotel chains offer the best value.",
      category: "Hotels",
      readTime: "6 min read",
      image: "/luxury-hotel-room-with-view.png",
      slug: "/blog/budget-luxury-hotels",
      date: "April 15, 2023",
    },
    {
      id: 4,
      title: "Hidden Gems: Underrated Destinations",
      excerpt:
        "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs. Discover beautiful locations that haven't been overrun by tourism.",
      category: "Destinations",
      readTime: "5 min read",
      image: "/secluded-beach-paradise.png",
      slug: "/blog/hidden-gem-destinations",
      date: "March 30, 2023",
    },
    {
      id: 5,
      title: "Travel Hacking 101: Getting Started",
      excerpt:
        "A beginner's guide to travel hacking with step-by-step instructions on how to start maximizing your travel rewards. Learn the fundamentals of points programs.",
      category: "Guide",
      readTime: "8 min read",
      image: "/travel-planning-laptop.png",
      slug: "/blog/travel-hacking-101",
      date: "March 15, 2023",
    },
  ]

  const blogPosts = posts.length > 0 ? posts : defaultPosts

  // Theme styles
  const themeStyles = {
    light: {
      container: "bg-white",
      title: "text-stone-900",
      subtitle: "text-stone-700",
      card: "bg-white border border-gray-200",
      category: "bg-gray-100 text-gray-700",
      date: "text-gray-500",
      excerpt: "text-gray-600",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-gray-700 hover:bg-gray-100",
      dots: "bg-gray-300",
      activeDot: "bg-teal-500",
    },
    dark: {
      container: "bg-stone-900",
      title: "text-white",
      subtitle: "text-gray-300",
      card: "bg-stone-800 border border-stone-700",
      category: "bg-stone-700 text-gray-300",
      date: "text-gray-400",
      excerpt: "text-gray-300",
      button: "text-teal-400 hover:text-orange-400",
      nav: "bg-stone-800 text-gray-300 hover:bg-stone-700",
      dots: "bg-gray-600",
      activeDot: "bg-teal-400",
    },
    teal: {
      container: "bg-teal-50",
      title: "text-stone-900",
      subtitle: "text-stone-700",
      card: "bg-white border border-teal-100",
      category: "bg-teal-100 text-teal-800",
      date: "text-teal-600",
      excerpt: "text-gray-600",
      button: "text-teal-600 hover:text-orange-500",
      nav: "bg-white text-teal-700 hover:bg-teal-50",
      dots: "bg-teal-200",
      activeDot: "bg-teal-500",
    },
  }

  const currentTheme = themeStyles[theme] || themeStyles.light

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Determine how many posts to show based on screen size
  const getPostsPerView = () => {
    if (isMobile) return postsPerView.mobile
    if (isTablet) return postsPerView.tablet
    return postsPerView.desktop
  }

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext()
      }, autoplayDelay)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [currentIndex, autoplay, autoplayDelay])

  // Navigation functions
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : blogPosts.length - getPostsPerView()))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < blogPosts.length - getPostsPerView() ? prevIndex + 1 : 0))
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      handleNext()
    }

    if (touchEnd - touchStart > 75) {
      // Swipe right
      handlePrev()
    }
  }

  // Handle card click to navigate to blog post
  const handleCardClick = (slug) => {
    router.push(slug)
  }

  // Calculate visible posts
  const visiblePosts = blogPosts.slice(currentIndex, currentIndex + getPostsPerView())

  // If we don't have enough posts to fill the view, add from the beginning
  if (visiblePosts.length < getPostsPerView()) {
    const additionalPosts = blogPosts.slice(0, getPostsPerView() - visiblePosts.length)
    visiblePosts.push(...additionalPosts)
  }

  return (
    <section
      className={`w-full max-w-[1440px] px-4 md:px-16 py-12 md:py-20 flex flex-col justify-start items-center gap-8 overflow-hidden ${className}`}
    >
      <div className="w-full flex flex-col justify-start items-center gap-4 text-center">
        <h2 className={`text-2xl md:text-4xl font-bold ${currentTheme.title}`}>{title}</h2>
        <p className={`text-base md:text-lg ${currentTheme.subtitle} max-w-2xl`}>{subtitle}</p>
      </div>

      <div className="w-full relative">
        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 p-2 rounded-full shadow-md ${currentTheme.nav} md:flex hidden items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
          aria-label="Previous posts"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 p-2 rounded-full shadow-md ${currentTheme.nav} md:flex hidden items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`}
          aria-label="Next posts"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${100 / getPostsPerView()}% * ${currentIndex}))`,
            }}
          >
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className={`flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer`}
                style={{ width: `${100 / getPostsPerView()}%` }}
                onClick={() => handleCardClick(post.slug)}
              >
                <div className={`h-full ${currentTheme.card} rounded-lg overflow-hidden shadow-md flex flex-col`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentTheme.category}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${currentTheme.date}`}>{post.date}</span>
                      <span className={`text-xs ${currentTheme.date}`}>{post.readTime}</span>
                    </div>

                    <h3 className={`text-xl font-bold ${currentTheme.title} line-clamp-2`}>{post.title}</h3>

                    <p className={`text-sm ${currentTheme.excerpt} line-clamp-3 flex-grow`}>{post.excerpt}</p>

                    <Link
                      href={post.slug}
                      className={`inline-flex items-center ${currentTheme.button} font-medium text-sm mt-2`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read More
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.min(blogPosts.length, blogPosts.length - getPostsPerView() + 1) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? `w-6 ${currentTheme.activeDot}` : currentTheme.dots
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ),
          )}
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Link href="/blog" className="inline-block">
          <OutlinedGradientButton>
            View all
          </OutlinedGradientButton>
        </Link>
      </div>
    </section>
  )
}

BlogCarousel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  posts: PropTypes.array,
  postsPerView: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
  }),
  className: PropTypes.string,
  autoplay: PropTypes.bool,
  autoplayDelay: PropTypes.number,
  theme: PropTypes.oneOf(["light", "dark", "teal"]),
}

export default BlogCarousel
