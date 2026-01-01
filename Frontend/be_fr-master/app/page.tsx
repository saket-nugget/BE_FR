"use client"

import { useState, useCallback } from "react"
import { Activity } from "lucide-react"
import { DropZone } from "@/components/drop-zone"
import { ScanningView } from "@/components/scanning-view"
import { ResultsView } from "@/components/results-view"

type ViewState = "upload" | "scanning" | "results"

export default function DeepfakeDetectorPage() {
  const [viewState, setViewState] = useState<ViewState>("upload")
  const [fileName, setFileName] = useState<string>("")
  const [analysisResult, setAnalysisResult] = useState<{
    isDeepfake: boolean
    reason: string
    face_score: number
    bg_score: number
  } | null>(null)

  const handleFileDrop = useCallback((file: File) => {
    setFileName(file.name)
    setViewState("scanning")

    // Send file to backend
    const formData = new FormData()
    formData.append("file", file)

    interface ApiResponse {
      isDeepfake: boolean;
      reason: string;
      face_score: number;
      bg_score: number;
      error?: string;
    }

    try {
      fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data: ApiResponse) => {
          if (data.error) {
            alert("Backend Error: " + data.error)
            setViewState("upload")
            return
          }
          setAnalysisResult({
            isDeepfake: data.isDeepfake,
            reason: data.reason,
            face_score: data.face_score,
            bg_score: data.bg_score
          })
          setViewState("results")
        })
        .catch((err) => {
          console.error("Error:", err)
          alert("Connection Failed. Is 'python backend.py' running?")
          setViewState("upload")
        })
    } catch (error) {
      console.error("Error:", error)
      setViewState("upload")
    }
  }, [])

  const handleReset = useCallback(() => {
    setViewState("upload")
    setFileName("")
    setIsDeepfake(false)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-mono tracking-wider text-white uppercase">Deepfake Detector</h1>
            </div>
            <div className="text-xs font-mono text-white/50 tracking-widest">AI VERIFICATION SYSTEM</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-8 py-12">
        {viewState === "upload" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4 tracking-tight">Media Authentication</h2>
              <p className="text-white/60 font-mono text-sm tracking-wide">UPLOAD VIDEO OR IMAGE FOR ANALYSIS</p>
            </div>
            <DropZone onFileDrop={handleFileDrop} />
          </div>
        )}

        {viewState === "scanning" && <ScanningView fileName={fileName} />}

        {viewState === "results" && analysisResult && (
          <ResultsView
            fileName={fileName}
            isDeepfake={analysisResult.isDeepfake}
            reason={analysisResult.reason}
            face_score={analysisResult.face_score}
            bg_score={analysisResult.bg_score}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between text-xs font-mono text-white/40 tracking-widest">
            <div>v2.4.1</div>
            <div>SECURE • ENCRYPTED • VERIFIED</div>
            <div>© 2025</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
