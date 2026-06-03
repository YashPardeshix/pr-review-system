import { useState } from "react"
import axios from "axios"

function SubmitView({ onSubmit }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!code.trim()) return
    setLoading(true)
    const response = await axios.post("http://127.0.0.1:8000/review", { code })
    onSubmit(response.data.thread_id, response.data.findings)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans">
      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto flex flex-col gap-6">
        <div className="border-b border-outline-variant pb-4">
          <h2 className="text-3xl font-bold text-on-surface">Submit Code for Review</h2>
          <p className="text-sm text-on-surface-variant mt-1">Paste your code below for automated AI analysis.</p>
        </div>
        <div className="flex flex-col bg-surface-container rounded-lg border border-outline-variant overflow-hidden">
          <div className="h-10 bg-surface-container-high border-b border-outline-variant flex items-center px-4 justify-between">
            <span className="text-xs text-on-surface-variant font-mono">code</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            spellCheck={false}
            className="w-full min-h-[400px] bg-transparent font-mono text-sm text-on-surface p-4 resize-none focus:outline-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary-container text-white font-semibold py-3 px-10 rounded shadow-lg transition-all duration-200 flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for AI Review"}
          </button>
        </div>
      </main>
    </div>
  )
}

export default SubmitView