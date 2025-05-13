"use client"

import { useState } from "react"
import CTASection from "../../components/CTASection/CTASection"
import Navbar from "../../components/Navbar/Navbar"

export default function CTADemo() {
  const [config, setConfig] = useState({
    title: "Stay Updated with Our Insights",
    description: "Subscribe to our newsletter for exclusive travel tips and the latest updates in travel rewards.",
    buttonText: "Subscribe",
    buttonVariant: "primary",
    withSubscribeForm: true,
    redirectUrl: "",
    design: "gradient-teal",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const presets = [
    {
      name: "Teal Gradient",
      config: {
        title: "Stay Updated with Our Insights",
        description: "Subscribe to our newsletter for exclusive travel tips and the latest updates in travel rewards.",
        buttonText: "Subscribe",
        buttonVariant: "primary",
        withSubscribeForm: true,
        redirectUrl: "",
        design: "gradient-teal",
      },
    },
    {
      name: "Orange Gradient",
      config: {
        title: "Ready to Maximize Your Travel Rewards?",
        description:
          "Book a free consultation with our travel rewards experts and start your journey to smarter travel.",
        buttonText: "Book Consultation",
        buttonVariant: "primary",
        withSubscribeForm: false,
        redirectUrl: "/consultation",
        design: "gradient-orange",
      },
    },
    {
      name: "Dot Pattern",
      config: {
        title: "Join Our Community of Travel Hackers",
        description:
          "Connect with like-minded travelers, share tips, and learn from the best in our exclusive community.",
        buttonText: "Join Now",
        buttonVariant: "outlined",
        withSubscribeForm: false,
        redirectUrl: "/community",
        design: "pattern-dots",
      },
    },
    {
      name: "Line Pattern",
      config: {
        title: "Get Premium Travel Insights",
        description:
          "Subscribe to our premium newsletter for in-depth analysis, exclusive deals, and personalized travel recommendations.",
        buttonText: "Subscribe Now",
        buttonVariant: "primary",
        withSubscribeForm: true,
        redirectUrl: "/thank-you",
        design: "pattern-lines",
      },
    },
    {
      name: "Teal Overlay",
      config: {
        title: "Never Miss a Travel Deal",
        description: "Be the first to know about exclusive travel deals and reward opportunities.",
        buttonText: "Subscribe",
        buttonVariant: "primary",
        withSubscribeForm: true,
        redirectUrl: "",
        design: "overlay-teal",
      },
    },
  ]

  // Custom subscribe handler for demo purposes
  const handleSubscribe = async (email) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Subscribed with email: ${email}`)
    // In a real implementation, you would make an API call to your backend
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">CTA Section Demo</h1>

          <div className="mb-12">
            <CTASection {...config} onSubscribe={handleSubscribe} />
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Design Presets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  onClick={() => setConfig(preset.config)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Customize CTA</h2>
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
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={config.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input
                  type="text"
                  name="buttonText"
                  value={config.buttonText}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Redirect URL (after subscribe/click)</label>
                <input
                  type="text"
                  name="redirectUrl"
                  value={config.redirectUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Leave empty for no redirect"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Button Variant</label>
                <select
                  name="buttonVariant"
                  value={config.buttonVariant}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outlined">Outlined</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Design</label>
                <select
                  name="design"
                  value={config.design}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="gradient-teal">Teal Gradient</option>
                  <option value="gradient-orange">Orange Gradient</option>
                  <option value="pattern-dots">Dot Pattern</option>
                  <option value="pattern-lines">Line Pattern</option>
                  <option value="overlay-teal">Teal Overlay</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="withSubscribeForm"
                  name="withSubscribeForm"
                  checked={config.withSubscribeForm}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="withSubscribeForm" className="text-sm font-medium">
                  Include Subscribe Form
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Usage Example</h2>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
              {`<CTASection
  title="${config.title}"
  description="${config.description}"
  buttonText="${config.buttonText}"
  buttonVariant="${config.buttonVariant}"
  withSubscribeForm={${config.withSubscribeForm}}
  ${config.redirectUrl ? `redirectUrl="${config.redirectUrl}"` : ""}
  design="${config.design}"
  ${
    !config.withSubscribeForm
      ? ""
      : `onSubscribe={async (email) => {
    // Handle subscription logic here
    await subscribeToNewsletter(email);
  }}`
  }
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
