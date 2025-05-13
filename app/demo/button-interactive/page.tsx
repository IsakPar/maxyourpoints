"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonInteractive() {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-50 to-orange-50">
          <h1 className="text-3xl font-bold text-center mb-2">Button State Visualizer</h1>
          <p className="text-center text-gray-600 mb-8">Interact with the button to see different states</p>

          <div className="flex flex-col items-center justify-center gap-12">
            {/* Large interactive button */}
            <div
              className="relative"
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
            >
              <Button size="large" className="px-10 py-4 text-xl">
                {isPressed ? "Pressed!" : "Click Me"}
              </Button>

              {/* State indicator */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isPressed ? "bg-purple-100 text-purple-800" : "bg-teal-100 text-teal-800"
                  }`}
                >
                  {isPressed ? "Active State" : "Default State"}
                </span>
              </div>
            </div>

            {/* State description */}
            <div className="w-full max-w-md bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                {isPressed ? "Active State Properties:" : "Hover to see hover state, click to see active state"}
              </h3>

              {isPressed && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Darker gradient (teal-600 to orange-600)</li>
                  <li>Inner shadow effect</li>
                  <li>Scale reduced to 95%</li>
                  <li>Quick 0.1s transition</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Code section */}
        <div className="bg-gray-900 p-6 text-gray-300">
          <h3 className="text-lg font-semibold mb-3 text-white">Implementation Code:</h3>
          <pre className="text-xs overflow-auto p-3 bg-gray-800 rounded">
            {`// Button component active state styling
"bg-gradient-to-br from-teal-500 to-orange-500 hover:bg-gradient-to-bl 
active:from-teal-600 active:to-orange-600 active:shadow-inner active:scale-95 
rounded-xl outline outline-1 outline-teal-500"`}
          </pre>
        </div>
      </div>

      <div className="mt-8">
        <Button href="/button-demo" variant="secondary">
          View All Button Variants
        </Button>
      </div>
    </div>
  )
}
