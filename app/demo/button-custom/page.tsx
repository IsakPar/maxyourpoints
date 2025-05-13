"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonCustom() {
  // Default colors based on the image
  const [startColor, setStartColor] = useState("#2DD4BF") // teal-400
  const [midColor, setMidColor] = useState("#EAB308") // yellow-500
  const [endColor, setEndColor] = useState("#EA580C") // orange-600

  // Custom button with inline styles for precise gradient control
  const CustomButton = () => {
    const style = {
      background: `linear-gradient(to right, ${startColor}, ${midColor}, ${endColor})`,
      backgroundSize: "200% 100%",
      backgroundPosition: "right bottom",
      transition: "background-position 0.5s ease",
    }

    const hoverStyle = {
      backgroundPosition: "left bottom",
    }

    return (
      <button
        className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg shadow-md text-white"
        style={style}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundPosition = "left bottom"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundPosition = "right bottom"
        }}
      >
        Custom Gradient Button
      </button>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Button Gradient Customizer</h1>

      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Updated Button</h2>
          <Button>Subscribe Now</Button>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Custom Gradient Button</h2>
          <CustomButton />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Color (Left)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={startColor}
                  onChange={(e) => setStartColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={startColor}
                  onChange={(e) => setStartColor(e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-24"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Middle Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={midColor}
                  onChange={(e) => setMidColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={midColor}
                  onChange={(e) => setMidColor(e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-24"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">End Color (Right)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={endColor}
                  onChange={(e) => setEndColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={endColor}
                  onChange={(e) => setEndColor(e.target.value)}
                  className="border rounded px-2 py-1 text-sm w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-md">
        <h3 className="font-semibold mb-2">Tailwind Gradient Classes:</h3>
        <code className="bg-gray-100 p-3 rounded block whitespace-pre-wrap text-sm">
          bg-gradient-to-r from-teal-500 via-yellow-500 to-orange-600
        </code>
      </div>
    </div>
  )
}
