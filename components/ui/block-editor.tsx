'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'

interface BlockEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

// Dynamically import BlockNote components to prevent SSR issues
const DynamicBlockNoteEditor = dynamic(
  () => import('./block-note-editor-core'),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }
)

export default function BlockEditor(props: BlockEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white ${props.className}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return <DynamicBlockNoteEditor {...props} />
} 