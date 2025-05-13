"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonGradientDemo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Outlined Button with Gradient Border</h1>

      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Hover Effect Demo</h2>
          <div
            className="relative p-8 bg-white rounded-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button variant="outlined">View all</Button>
            <div className="mt-4 text-center text-sm">
              {isHovered ? "Hover state: Gradient border" : "Default state: Black border"}
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
        <h2 className="text-xl font-semibold mb-4">Gradient Border Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Black border in default state</li>
          <li>Border transitions to gradient on hover</li>
          <li>Button maintains its original size during hover</li>
          <li>Smooth transition between states</li>
          <li>Uses the existing gradient theme (teal to orange)</li>
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
