"use client";
import dynamic from "next/dynamic"

// Use dynamic import with no SSR to avoid hydration issues
const App = dynamic(() => import("./App"), { ssr: false })

export default function Home() {
  return <App />
}
