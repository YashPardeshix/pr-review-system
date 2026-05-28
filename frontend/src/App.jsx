import { useState } from "react"
import SubmitView from "./SubmitView"
import PendingView from "./PendingView"

function App() {
  const [view, setView] = useState("submit")
  const [threadId, setThreadId] = useState(null)
  const [findings, setFindings] = useState([])

  const handleSubmit = (threadId) => {
    setThreadId(threadId)
    setView("pending")
}

const handleApprove = () => {
  setView("history")
}

  return (
    <div>
      {view === "submit" && <SubmitView onSubmit={handleSubmit} />}
      {view === "pending" && <PendingView threadId={threadId} onApprove={handleApprove}/>}
      {view === "history" && <p>History View</p>}
    </div>
  )
}

export default App