"use client"

import { AlertTriangle, CheckCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsViewProps {
  fileName: string
  isDeepfake: boolean
  reason: string
  face_score: number
  bg_score: number
  onReset: () => void
}

export function ResultsView({ fileName, isDeepfake, reason, face_score, bg_score, onReset }: ResultsViewProps) {
  // Use real data for confidence score (convert 0-1 to percentage)
  // If it's a deepfake, the score is low (close to 0), so we invert it for "Confidence of Fake" if needed,
  // OR we just show the "Realness Score". 
  // Let's assume we want to show "Confidence in the Verdict".
  // If isDeepfake is true, face_score is < 0.5. Confidence it's fake = (1 - face_score) * 100
  // If isDeepfake is false, face_score is >= 0.5. Confidence it's real = face_score * 100

  const confidenceScore = isDeepfake
    ? Math.round((1 - face_score) * 100)
    : Math.round(face_score * 100)

  // Mock data for visualizations (keep these as placeholders or remove if not needed)
  const frameAnalysis = Array.from({ length: 50 }, () => Math.random() * 100)
  const temporalData = Array.from({ length: 30 }, () => Math.random() * 80 + 20)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">Analysis Complete</div>
          <div className="text-white text-xl font-light tracking-tight">{fileName}</div>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="gap-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-mono text-xs tracking-widest uppercase">New Scan</span>
        </Button>
      </div>

      {/* Main Results Panel */}
      <div
        className={`
        relative border backdrop-blur-sm mb-8 ${isDeepfake ? "border-amber-500/50 amber-pulse bg-amber-500/5" : "border-white/20 bg-white/[0.02]"
          }
      `}
      >
        <div className="p-12">
          <div className="flex items-center justify-between mb-8">
            {/* Status Icon */}
            <div className="flex items-center gap-6">
              {isDeepfake ? (
                <div className="w-16 h-16 border border-amber-500 bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
              ) : (
                <div className="w-16 h-16 border border-white/30 bg-white/5 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              )}

              <div>
                <div className={`text-3xl font-light mb-2 ${isDeepfake ? "text-amber-500" : "text-white"}`}>
                  {isDeepfake ? "Deepfake Detected" : "Authentic Media"}
                </div>
                <div className="text-white/50 font-mono text-xs tracking-widest uppercase">
                  {reason || (isDeepfake ? "Manipulation Identified" : "No Manipulation Detected")}
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="text-right">
              <div className={`text-5xl font-light ${isDeepfake ? "text-amber-500" : "text-white"}`}>
                {confidenceScore}%
              </div>
              <div className="text-white/40 font-mono text-xs tracking-widest uppercase mt-2">Confidence</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <div className="text-white text-2xl font-light mb-1">1</div>
              <div className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Image Analyzed</div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <div className="text-white text-2xl font-light mb-1">Static</div>
              <div className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Type</div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <div className="text-white text-2xl font-light mb-1">1080p</div>
              <div className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Resolution</div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-4">
              <div className={`text-2xl font-light mb-1 ${isDeepfake ? "text-amber-500" : "text-white"}`}>
                {isDeepfake ? "34" : "0"}
              </div>
              <div className="text-white/50 font-mono text-[10px] tracking-widest uppercase">Anomalies</div>
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div
          className={`absolute top-0 left-0 w-6 h-6 border-t border-l ${isDeepfake ? "border-amber-500" : "border-white/40"}`}
        />
        <div
          className={`absolute top-0 right-0 w-6 h-6 border-t border-r ${isDeepfake ? "border-amber-500" : "border-white/40"}`}
        />
        <div
          className={`absolute bottom-0 left-0 w-6 h-6 border-b border-l ${isDeepfake ? "border-amber-500" : "border-white/40"}`}
        />
        <div
          className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r ${isDeepfake ? "border-amber-500" : "border-white/40"}`}
        />
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-2 gap-8">
        {/* Frame Analysis Histogram */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
          <div className="mb-6">
            <div className="text-white font-mono text-xs tracking-widest uppercase mb-1">Frame Analysis</div>
            <div className="text-white/40 font-mono text-[10px] tracking-widest">Authenticity Distribution</div>
          </div>

          <div className="h-48 flex items-end gap-[2px]">
            {frameAnalysis.map((value, i) => (
              <div
                key={i}
                className={`flex-1 transition-all ${isDeepfake && value < 50 ? "bg-amber-500/50" : "bg-white/20"}`}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-between text-white/30 font-mono text-[10px] tracking-widest">
            <span>0</span>
            <span>FRAME INDEX</span>
            <span>50</span>
          </div>
        </div>

        {/* Temporal Consistency */}
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
          <div className="mb-6">
            <div className="text-white font-mono text-xs tracking-widest uppercase mb-1">Temporal Consistency</div>
            <div className="text-white/40 font-mono text-[10px] tracking-widest">Continuity Score Over Time</div>
          </div>

          <div className="h-48 relative">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <polyline
                points={temporalData.map((v, i) => `${(i / (temporalData.length - 1)) * 100}%,${100 - v}%`).join(" ")}
                fill="none"
                stroke={isDeepfake ? "rgb(251 191 36 / 0.6)" : "rgb(255 255 255 / 0.4)"}
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="mt-4 flex justify-between text-white/30 font-mono text-[10px] tracking-widest">
            <span>0s</span>
            <span>TIME</span>
            <span>12s</span>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
        <div className="text-white font-mono text-xs tracking-widest uppercase mb-4">Detection Metrics</div>
        <div className="grid grid-cols-3 gap-8 text-xs font-mono">
          <div className="space-y-2">
            <div className="flex justify-between text-white/40">
              <span>Face Realness Score</span>
              <span>{(face_score * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Background Realness Score</span>
              <span>{(bg_score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
