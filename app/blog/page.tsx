"use client"

import * as React from "react"
import BlogShowcase from "../../components/BlogShowcase"
import Navbar from "../../components/Navbar/Navbar"
import { ChevronRight } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"
import CTASection from "../../components/CTASection/CTASection"

interface BlogPost {
  id: number
  title: string
  summary: string
  category: string
  readTime: string
  image: string
  slug: string
  author: string
  date: string
}

const CategoryTag = ({ children }: { children: React.ReactNode }) => {
  return <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">{children}</span>
}

export default function BlogPage() {
  const router = useRouter()

  // Sample blog posts data - in a real app, this would come from an API or CMS
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Maximize Your Airline Points",
      summary:
        "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use to get more from their miles and travel further for less.",
      category: "Airline",
      readTime: "5 min read",
      image: "/placeholder.svg?key=1fxec",
      slug: "/blog/maximize-airline-points",
      author: "Sarah Johnson",
      date: "May 10, 2023",
    },
    {
      id: 2,
      title: "Best Credit Cards for Travel",
      summary:
        "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers. Compare sign-up bonuses, earning rates, and redemption options to find your perfect travel companion.",
      category: "Credit",
      readTime: "7 min read",
      image: "/travel-rewards-cards.png",
      slug: "/blog/best-credit-cards-travel",
      author: "Michael Chen",
      date: "April 28, 2023",
    },
    {
      id: 3,
      title: "Top Hotels for Budget Travelers",
      summary:
        "Find out how to book luxury accommodations without breaking the bank using points, promotions, and insider strategies. Learn which hotel chains offer the best value and how to maximize elite status benefits.",
      category: "Hotels",
      readTime: "6 min read",
      image: "/luxury-hotel-room-with-view.png",
      slug: "/blog/budget-luxury-hotels",
      author: "Emma Rodriguez",
      date: "April 15, 2023",
    },
    {
      id: 4,
      title: "Hidden Gems: Underrated Destinations",
      summary:
        "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs. Discover beautiful locations that haven't been overrun by tourism and offer authentic cultural experiences.",
      category: "Destinations",
      readTime: "5 min read",
      image: "/hidden-beach-paradise.png",
      slug: "/blog/hidden-gem-destinations",
      author: "David Thompson",
      date: "March 30, 2023",
    },
    {
      id: 5,
      title: "Travel Hacking 101: Getting Started",
      summary:
        "A beginner's guide to travel hacking with step-by-step instructions on how to start maximizing your travel rewards. Learn the fundamentals of points programs and how to develop a strategy that works for your travel goals.",
      category: "Guide",
      readTime: "8 min read",
      image: "/travel-planning-laptop.png",
      slug: "/blog/travel-hacking-101",
      author: "Jessica Williams",
      date: "March 15, 2023",
    },
    {
      id: 6,
      title: "First Class for Economy Price",
      summary:
        "Strategies for upgrading your flight experience without paying premium prices using points and status. Discover the best times to book, how to leverage airline partnerships, and techniques for successful upgrades.",
      category: "Airline",
      readTime: "6 min read",
      image: "/first-class-cabin.png",
      slug: "/blog/first-class-economy-price",
      author: "Robert Garcia",
      date: "February 28, 2023",
    },
    {
      id: 7,
      title: "Maximizing Hotel Elite Status",
      summary:
        "How to earn and leverage hotel elite status for room upgrades, free breakfast, late checkout, and more perks. Learn which hotel programs offer the best elite benefits and how to fast-track your status.",
      category: "Hotels",
      readTime: "7 min read",
      image: "/luxury-hotel-lobby.png",
      slug: "/blog/hotel-elite-status",
      author: "Amanda Lee",
      date: "February 15, 2023",
    },
    {
      id: 8,
      title: "Award Booking Sweet Spots",
      summary:
        "Discover the best value redemptions across major airline and hotel loyalty programs to maximize your points. Learn which transfer partners offer the best deals and how to find hidden award availability.",
      category: "Rewards",
      readTime: "9 min read",
      image: "/world-flight-paths.png",
      slug: "/blog/award-booking-sweet-spots",
      author: "Thomas Wilson",
      date: "January 30, 2023",
    },
  ]

  const handleCardClick = (slug: string): void => {
    router.push(slug)
  }

  // Custom subscribe handler for the blog page
  const handleSubscribe = async (email: string): Promise<void> => {
    // In a real implementation, you would make an API call to your backend
    console.log(`Blog page subscription with email: ${email}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="w-full bg-emerald-100 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">MaxYourPoints Blog</h1>
            <p className="text-xl text-center max-w-3xl mx-auto">
              Expert insights, tips, and strategies to help you maximize your travel rewards and explore the world for
              less.
            </p>
          </div>
        </div>

        <div className="bg-teal-50">
          <BlogShowcase
            title="All Articles"
            subtitle="Browse our complete collection of travel hacking insights and strategies."
            posts={blogPosts.slice(0, 4)}
          />

          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-16 flex flex-col gap-8">
            <h2 className="text-2xl md:text-3xl font-bold">More Articles</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogPosts.slice(4).map((post: BlogPost) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-4 bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-elevation cursor-pointer"
                  onClick={() => handleCardClick(post.slug)}
                >
                  <div className="h-48 overflow-hidden">
                    <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <CategoryTag>{post.category}</CategoryTag>
                      <span className="text-sm text-gray-600">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p className="text-sm line-clamp-3">{post.summary}</p>
                    <a
                      href={post.slug}
                      className="mt-2 inline-flex items-center gap-1 text-teal-600 font-medium hover:text-orange-500 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Read more <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outlined">Load more articles</Button>
            </div>
          </div>
        </div>

        {/* Updated CTA Section with a different visually engaging design */}
        <div className="bg-teal-50">
          <CTASection
            title="Never Miss a Travel Deal"
            description="Subscribe to our newsletter and be the first to know about exclusive travel deals and reward opportunities."
            buttonText="Subscribe"
            buttonVariant="primary"
            withSubscribeForm={true}
            onSubscribe={handleSubscribe}
            design="overlay-teal"
          />
        </div>
      </div>
    </div>
  )
}
