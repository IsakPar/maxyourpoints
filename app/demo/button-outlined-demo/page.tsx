"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonOutlinedDemo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Refined Outlined Button Demo</h1>

      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Refined Outlined Button</h2>
          <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Button variant="outlined">View all</Button>
            <div className="mt-4 text-center text-sm">
              {isHovered ? "Hover state: Gradient border (same size)" : "Default state: Black border"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-lg font-medium">Primary Button</h3>
            <Button>Primary</Button>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-lg font-medium">Secondary Button</h3>
            <Button variant="secondary">Secondary</Button>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <h3 className="text-lg font-medium">Outlined Button</h3>
            <Button variant="outlined">Outlined</Button>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Refined Outlined Button Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Thick black border in default state</li>
          <li>Black text that remains black on hover</li>
          <li>Only the border transitions to gradient on hover</li>
          <li>Button maintains exact same size during hover</li>
          <li>Smooth transition between states</li>
          <li>Scale reduction on click for tactile feedback</li>
        </ul>

        <div className="mt-8 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium mb-2">Implementation:</h3>
          <pre className="text-xs overflow-x-auto p-3 bg-gray-800 text-gray-200 rounded">
            {`<Button variant="outlined">View all</Button>`}
          </pre>
        </div>
      </div>
    </div>
  )
}
