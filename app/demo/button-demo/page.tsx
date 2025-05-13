"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonDemo() {
  const [activeButton, setActiveButton] = useState(null)

  // Function to simulate active state for demonstration
  const handleMouseDown = (buttonId) => {
    setActiveButton(buttonId)
  }

  const handleMouseUp = () => {
    setActiveButton(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Button Component Demo</h1>

      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Default Size</h2>
          <Button>Button</Button>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Small Size</h2>
          <Button size="small">Button</Button>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Large Size</h2>
          <Button size="large">Button</Button>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Secondary Variant</h2>
          <Button variant="secondary">Button</Button>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-xl font-semibold">Ghost Variant</h2>
          <Button variant="ghost">Button</Button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md">
        <h3 className="font-semibold mb-2">Button States:</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Default</span>
            <Button>Default</Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Hover</span>
            <Button className="hover:bg-gradient-to-bl">Hover</Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Active</span>
            <Button
              className={activeButton === "demo" ? "from-teal-600 to-orange-600 shadow-inner scale-95" : ""}
              onMouseDown={() => handleMouseDown("demo")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              Click Me
            </Button>
          </div>
        </div>

        <h3 className="font-semibold mt-6 mb-2">Active State Features:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Darker gradient colors (teal-600 to orange-600)</li>
          <li>Inner shadow effect to simulate depression</li>
          <li>Slight scale reduction (95%)</li>
          <li>Quick transition (0.1s) for responsive feedback</li>
        </ul>

        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-800">
          <strong>Tip:</strong> Click and hold any button to see the active state in action.
        </div>
      </div>
    </div>
  )
}
