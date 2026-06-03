import { useState } from "react"
import SubmitView from "./SubmitView"
import PendingView from "./PendingView"
import HistoryView from "./HistoryView"

function App() {
  const [view, setView] = useState("submit")
  const [threadId, setThreadId] = useState(null)
  const [findings, setFindings] = useState([])

  const handleSubmit = (threadId, findings) => {
    setThreadId(threadId)
    setFindings(findings)
    setView("pending")
}

  const handleApprove = () => {
    setView("history")
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <nav className="bg-surface-variant fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-6 border-b border-outline-variant">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-on-surface">PR Review System</span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView("submit")}
              className={`text-sm pb-1 transition-colors ${view === "submit" ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              Submit
            </button>
            <button
              onClick={() => setView("pending")}
              className={`text-sm pb-1 transition-colors ${view === "pending" ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setView("history")}
              className={`text-sm pb-1 transition-colors ${view === "history" ? "text-primary font-bold border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {view === "submit" && <SubmitView onSubmit={handleSubmit} />}
      {view === "pending" && <PendingView threadId={threadId} findings={findings} onApprove={handleApprove} />}
      {view === "history" && <HistoryView />}
    </div>
  )
}

export default App