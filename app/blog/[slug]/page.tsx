"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Navbar from "../../../components/Navbar/Navbar"
import { Calendar, Clock, User } from "lucide-react"
import BlogShowcase from "../../../components/BlogShowcase"

// Sample blog posts data - in a real app, this would come from an API or CMS
const blogPosts = [
  {
    id: 1,
    title: "Maximize Your Airline Points",
    summary: "Learn how to strategically earn and redeem airline points for maximum value on your next trip.",
    category: "Airline",
    readTime: "5 min read",
    image: "/placeholder.svg?key=e22n6",
    slug: "maximize-airline-points",
    author: "Sarah Johnson",
    date: "May 10, 2023",
    content: `
      <p>Airline points are one of the most valuable travel currencies when used strategically. This guide will help you understand how to maximize their value for incredible travel experiences.</p>
      
      <h2>Earning Strategies</h2>
      <p>The first step to maximizing airline points is knowing how to earn them efficiently:</p>
      <ul>
        <li><strong>Credit Card Sign-up Bonuses:</strong> These often provide the quickest way to earn a large number of points at once.</li>
        <li><strong>Category Bonuses:</strong> Use cards that offer bonus points for specific spending categories like dining, groceries, or travel.</li>
        <li><strong>Shopping Portals:</strong> Most airlines have shopping portals that award additional points for online purchases you'd make anyway.</li>
        <li><strong>Dining Programs:</strong> Register your credit cards with airline dining programs to earn extra points when eating at participating restaurants.</li>
      </ul>
      
      <h2>Redemption Sweet Spots</h2>
      <p>Not all redemptions offer equal value. Here are some ways to get the most from your points:</p>
      <ul>
        <li><strong>International Premium Cabins:</strong> Business and first-class redemptions typically offer the highest cents-per-point value.</li>
        <li><strong>Partner Airlines:</strong> Sometimes booking through partner airlines can require fewer points for the same flight.</li>
        <li><strong>Off-peak Travel:</strong> Many programs offer discounted award rates during less popular travel times.</li>
        <li><strong>Avoid Fuel Surcharges:</strong> Some airlines add significant fees to award tickets. Research which partners have lower fees.</li>
      </ul>
      
      <h2>Advanced Techniques</h2>
      <p>Once you've mastered the basics, consider these advanced strategies:</p>
      <ul>
        <li><strong>Mixed-cabin Itineraries:</strong> Book business class for the longest segments and economy for shorter ones to save points.</li>
        <li><strong>Open-jaw and Stopover Tickets:</strong> Some programs allow you to visit multiple cities for the same amount of points.</li>
        <li><strong>Points Pooling:</strong> Certain programs allow family members to combine points for redemptions.</li>
        <li><strong>Status Matching:</strong> If you have status with one airline, you may be able to match it with another.</li>
      </ul>
      
      <p>Remember that the value of points can change with program updates, so staying informed about program changes is essential for maximizing your rewards.</p>
    `,
  },
  {
    id: 2,
    title: "Best Credit Cards for Travel",
    summary:
      "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers.",
    category: "Credit",
    readTime: "7 min read",
    image: "/travel-rewards-cards.png",
    slug: "best-credit-cards-travel",
    author: "Michael Chen",
    date: "April 28, 2023",
    content: `<p>Sample content for Best Credit Cards for Travel article...</p>`,
  },
  {
    id: 3,
    title: "Top Hotels for Budget Travelers",
    summary:
      "Find out how to book luxury accommodations without breaking the bank using points, promotions, and insider strategies.",
    category: "Hotels",
    readTime: "6 min read",
    image: "/luxury-hotel-room-with-view.png",
    slug: "budget-luxury-hotels",
    author: "Emma Rodriguez",
    date: "April 15, 2023",
    content: `<p>Sample content for Top Hotels for Budget Travelers article...</p>`,
  },
  {
    id: 4,
    title: "Hidden Gems: Underrated Destinations",
    summary:
      "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs.",
    category: "Destinations",
    readTime: "5 min read",
    image: "/hidden-beach-paradise.png",
    slug: "hidden-gem-destinations",
    author: "David Thompson",
    date: "March 30, 2023",
    content: `<p>Sample content for Hidden Gems article...</p>`,
  },
]

export default function BlogPostPage() {
  const pathname = usePathname()
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (pathname) {
      const slug = pathname.split("/").pop()
      const foundPost = blogPosts.find((p) => p.slug === slug)
      setPost(foundPost || null)
    }
  }, [pathname])

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-[50vh]">
          <p className="text-xl">Loading post...</p>
        </div>
      </div>
    )
  }

  // Filter out the current post and get related posts
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Hero section */}
        <div className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10"></div>
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-[50vh] object-cover" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <div className="inline-flex justify-center items-center mb-4">
                <div className="px-3 py-1 bg-emerald-500/80 rounded-md text-sm font-bold">{post.category}</div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto">{post.title}</h1>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Related posts */}
        <div className="bg-emerald-50">
          <BlogShowcase
            title="Related Articles"
            subtitle="Explore more travel hacking insights and strategies."
            posts={relatedPosts}
          />
        </div>
      </div>
    </div>
  )
}
