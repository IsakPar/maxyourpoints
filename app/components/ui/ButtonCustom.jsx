"use client"

import { useState } from "react"
import { Button } from "./button"

export default function ButtonCustom({
  children = "Custom Gradient Button",
  className = "",
  startColor = "#2DD4BF",
  midColor = "#EAB308",
  endColor = "#EA580C",
  showColorPicker = false,
  onChange,
}) {
  const [colors, setColors] = useState({
    start: startColor,
    mid: midColor,
    end: endColor,
  })

  const handleColorChange = (position, value) => {
    const newColors = { ...colors, [position]: value }
    setColors(newColors)
    if (onChange) {
      onChange(newColors)
    }
  }

  const style = {
    background: `linear-gradient(to right, ${colors.start}, ${colors.mid}, ${colors.end})`,
    backgroundSize: "200% 100%",
    backgroundPosition: "left bottom",
    transition: "background-position 0.5s ease",
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        className={`px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg shadow-md text-white ${className}`}
        style={style}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundPosition = "right bottom"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundPosition = "left bottom"
        }}
      >
        {children}
      </button>

      {showColorPicker && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Start Color (Left)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.start}
                onChange={(e) => handleColorChange("start", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.start}
                onChange={(e) => handleColorChange("start", e.target.value)}
                className="border rounded px-2 py-1 text-sm w-24"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Middle Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.mid}
                onChange={(e) => handleColorChange("mid", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.mid}
                onChange={(e) => handleColorChange("mid", e.target.value)}
                className="border rounded px-2 py-1 text-sm w-24"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">End Color (Right)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colors.end}
                onChange={(e) => handleColorChange("end", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={colors.end}
                onChange={(e) => handleColorChange("end", e.target.value)}
                className="border rounded px-2 py-1 text-sm w-24"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 