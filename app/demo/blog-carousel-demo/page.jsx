"use client"

import { useState } from "react"
import Navbar from "../../components/Navbar/Navbar"
import BlogCarousel from "../../components/BlogCarousel/BlogCarousel"

export default function BlogCarouselDemo() {
  const [config, setConfig] = useState({
    title: "Latest from Our Blog",
    subtitle: "Discover our most recent insights and travel tips",
    postsPerView: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    autoplay: false,
    autoplayDelay: 5000,
    theme: "light",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name.includes("postsPerView")) {
      const key = name.split(".")[1]
      setConfig({
        ...config,
        postsPerView: {
          ...config.postsPerView,
          [key]: Number.parseInt(value, 10),
        },
      })
    } else {
      setConfig({
        ...config,
        [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value, 10) : value,
      })
    }
  }

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Maximize Your Airline Points",
      excerpt:
        "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use.",
      category: "Airline",
      readTime: "5 min read",
      image: "/placeholder.svg?key=mityo",
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
      image: "/placeholder.svg?key=a8m1d",
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

  const presets = [
    {
      name: "Default Light",
      config: {
        title: "Latest from Our Blog",
        subtitle: "Discover our most recent insights and travel tips",
        postsPerView: { mobile: 1, tablet: 2, desktop: 3 },
        autoplay: false,
        autoplayDelay: 5000,
        theme: "light",
      },
    },
    {
      name: "Dark Theme",
      config: {
        title: "Featured Articles",
        subtitle: "Explore our most popular travel hacking guides",
        postsPerView: { mobile: 1, tablet: 2, desktop: 3 },
        autoplay: true,
        autoplayDelay: 4000,
        theme: "dark",
      },
    },
    {
      name: "Teal Theme",
      config: {
        title: "Travel Insights",
        subtitle: "Expert advice to maximize your travel experience",
        postsPerView: { mobile: 1, tablet: 2, desktop: 3 },
        autoplay: false,
        autoplayDelay: 5000,
        theme: "teal",
      },
    },
    {
      name: "Compact View",
      config: {
        title: "Quick Reads",
        subtitle: "Short articles for busy travelers",
        postsPerView: { mobile: 1, tablet: 3, desktop: 4 },
        autoplay: true,
        autoplayDelay: 3000,
        theme: "light",
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Blog Carousel Demo</h1>

          <div className="mb-12">
            <BlogCarousel {...config} posts={blogPosts} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setConfig(preset.config)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Customize Carousel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={config.subtitle}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select name="theme" value={config.theme} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="teal">Teal</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoplay"
                  name="autoplay"
                  checked={config.autoplay}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="autoplay" className="text-sm font-medium">
                  Enable Autoplay
                </label>
              </div>
              {config.autoplay && (
                <div>
                  <label className="block text-sm font-medium mb-2">Autoplay Delay (ms)</label>
                  <input
                    type="number"
                    name="autoplayDelay"
                    value={config.autoplayDelay}
                    onChange={handleChange}
                    min="1000"
                    step="500"
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">Posts Per View (Mobile)</label>
                <input
                  type="number"
                  name="postsPerView.mobile"
                  value={config.postsPerView.mobile}
                  onChange={handleChange}
                  min="1"
                  max="2"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Posts Per View (Tablet)</label>
                <input
                  type="number"
                  name="postsPerView.tablet"
                  value={config.postsPerView.tablet}
                  onChange={handleChange}
                  min="1"
                  max="3"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Posts Per View (Desktop)</label>
                <input
                  type="number"
                  name="postsPerView.desktop"
                  value={config.postsPerView.desktop}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Usage Example</h2>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
              {`<BlogCarousel
  title="${config.title}"
  subtitle="${config.subtitle}"
  postsPerView={{
    mobile: ${config.postsPerView.mobile},
    tablet: ${config.postsPerView.tablet},
    desktop: ${config.postsPerView.desktop}
  }}
  autoplay={${config.autoplay}}
  ${config.autoplay ? `autoplayDelay={${config.autoplayDelay}}` : ""}
  theme="${config.theme}"
  posts={blogPosts}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
