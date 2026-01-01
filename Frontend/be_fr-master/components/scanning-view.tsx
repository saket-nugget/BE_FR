"use client"

import { useEffect, useState } from "react"

interface ScanningViewProps {
  fileName: string
}

export function ScanningView({ fileName }: ScanningViewProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("Initializing")

  useEffect(() => {
    const phases = [
      { name: "Initializing", duration: 500 },
      { name: "Frame Extraction", duration: 1000 },
      { name: "Neural Analysis", duration: 1500 },
      { name: "Pattern Recognition", duration: 1000 },
    ]

    let totalTime = 0
    phases.forEach((phase, index) => {
      setTimeout(() => {
        setCurrentPhase(phase.name)
        const phaseProgress = ((index + 1) / phases.length) * 100
        setProgress(phaseProgress)
      }, totalTime)
      totalTime += phase.duration
    })
  }, [])

  return (
    <div className="max-w-5xl mx-auto">
      {/* File Info Header */}
      <div className="mb-12 text-center">
        <div className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">Analyzing File</div>
        <div className="text-white text-xl font-light tracking-tight">{fileName}</div>
      </div>

      {/* Main Scanning Area */}
      <div className="relative h-[600px] border border-white/20 bg-white/[0.02] backdrop-blur-sm">
        {/* Frosted glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        {/* Laser Sweep Line */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="laser-sweep absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
            style={{ top: "50%" }}
          />
        </div>

        {/* Center Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-12 px-8">
          {/* Status */}
          <div className="text-center space-y-4">
            <div className="text-white font-mono text-sm tracking-widest uppercase">Scanning...</div>
            <div className="text-white/60 text-xs font-mono tracking-wide">{currentPhase}</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="h-[1px] bg-white/20 relative overflow-hidden">
              <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 text-center text-white/40 font-mono text-xs tracking-widest">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Data Grid Visualization */}
          <div className="grid grid-cols-12 gap-2 w-full max-w-2xl">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 border border-white/10 transition-all duration-300 ${
                  i < (progress / 100) * 48 ? "bg-white/10" : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/40" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/40" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/40" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/40" />
      </div>

      {/* Status Footer */}
      <div className="mt-6 text-center text-white/30 font-mono text-[10px] tracking-widest uppercase">
        Deep Neural Network • Frame-by-Frame Analysis • Secure Processing
      </div>
    </div>
  )
}
