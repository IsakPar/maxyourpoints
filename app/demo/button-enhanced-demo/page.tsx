"use client"

import { useState } from "react"
import Button from "../../components/ui/Button"

export default function ButtonEnhancedDemo() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-emerald-50">
      <h1 className="text-3xl font-bold text-center">Enhanced Outlined Button</h1>

      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-xl font-semibold">Hover Effect Demo</h2>
          <div
            className="relative p-8 bg-emerald-50 rounded-lg border border-dashed border-gray-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button variant="outlined">View all</Button>
            <div className="mt-4 text-center text-sm">
              {isHovered ? "Hover state: Enlarged gradient border" : "Default state: Black border"}
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enhanced Button Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Background matches the section's emerald-50 color</li>
            <li>Black border in default state</li>
            <li>Border increases in size on hover</li>
            <li>Border transitions to gradient on hover</li>
            <li>Button content remains stable during transition</li>
            <li>Smooth animation between states</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Implementation:</h3>
            <pre className="text-xs overflow-x-auto p-3 bg-gray-800 text-gray-200 rounded">
              {`<Button variant="outlined">View all</Button>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
