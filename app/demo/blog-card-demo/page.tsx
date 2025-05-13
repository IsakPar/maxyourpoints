"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Button from "../../components/ui/Button"

export default function BlogCardDemo() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const blogPosts = [
    {
      id: 1,
      title: "Maximize Your Airline Points",
      summary: "Learn how to strategically earn and redeem airline points for maximum value on your next trip.",
      category: "Airline",
      readTime: "5 min read",
      image: "/placeholder.svg?key=quq3l",
    },
    {
      id: 2,
      title: "Best Credit Cards for Travel",
      summary: "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits.",
      category: "Credit",
      readTime: "7 min read",
      image: "/travel-rewards-cards.png",
    },
  ]

  const CategoryTag = ({ children }) => {
    return (
      <div className="px-2.5 py-1 bg-transparent rounded-md outline outline-1 outline-stone-950/20 flex justify-start items-start">
        <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-emerald-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Blog Card Hover Effects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className={`flex flex-col md:flex-row justify-start items-start gap-4 md:gap-8 p-4 rounded-lg transition-all duration-300 ${
                hoveredCard === post.id ? "shadow-elevation" : ""
              } cursor-pointer bg-transparent`}
              onMouseEnter={() => setHoveredCard(post.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="w-full md:w-2/5 h-48 flex-shrink-0 overflow-hidden rounded-md">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-3/5 flex flex-col justify-start items-start gap-4">
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="flex justify-start items-center gap-4">
                    <CategoryTag>{post.category}</CategoryTag>
                    <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">{post.readTime}</div>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="w-full text-stone-950 text-xl md:text-2xl font-bold leading-relaxed">
                      {post.title}
                    </h3>
                    <p className="w-full text-stone-950 text-base font-bold font-['Inter'] leading-normal">
                      {post.summary}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl inline-flex justify-center items-center gap-2 text-stone-950 hover:text-orange-500 transition-colors">
                  <span className="text-base font-bold font-['Inter'] leading-normal">Read more</span>
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Refined Blog Card Hover Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Entire card is clickable and navigates to the article</li>
            <li>Card elevates with a subtle shadow effect on hover</li>
            <li>Background remains transparent during hover state</li>
            <li>Smooth transitions between states</li>
            <li>Visual feedback provides clear indication of interactivity</li>
          </ul>

          <div className="mt-8 flex justify-center">
            <Button variant="outlined">View all articles</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
