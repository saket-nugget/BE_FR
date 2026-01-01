"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload } from "lucide-react"

interface DropZoneProps {
  onFileDrop: (file: File) => void
}

export function DropZone({ onFileDrop }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
        onFileDrop(file)
      }
    },
    [onFileDrop],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileDrop(file)
      }
    },
    [onFileDrop],
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative h-[500px] border transition-all duration-300
        ${isDragging ? "border-white/60 pulse-glow bg-white/5" : "border-white/20 bg-white/[0.02]"}
        backdrop-blur-sm
      `}
    >
      {/* Frosted glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative h-full flex flex-col items-center justify-center gap-8 px-8">
        {/* Upload Icon */}
        <div
          className={`
          w-20 h-20 border flex items-center justify-center transition-all duration-300
          ${isDragging ? "border-white/60 bg-white/10" : "border-white/30 bg-white/5"}
        `}
        >
          <Upload className={`w-10 h-10 transition-colors ${isDragging ? "text-white" : "text-white/60"}`} />
        </div>

        {/* Text */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-light text-white tracking-tight">Drop Media File</h3>
          <p className="text-white/50 font-mono text-xs tracking-widest uppercase">Video • Image • Audio</p>
        </div>

        {/* File Input */}
        <label className="cursor-pointer">
          <input type="file" accept="image/*,video/*" onChange={handleFileInput} className="hidden" />
          <div className="px-8 py-3 border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-200">
            <span className="text-white font-mono text-xs tracking-widest uppercase">Browse Files</span>
          </div>
        </label>

        {/* Format Info */}
        <div className="text-white/30 font-mono text-[10px] tracking-widest uppercase">
          Max 500mb • Mp4, Mov, Jpg, Png
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/40" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/40" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/40" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/40" />
    </div>
  )
}
