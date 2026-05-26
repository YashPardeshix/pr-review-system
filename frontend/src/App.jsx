import { useState } from "react"
import SubmitView from "./SubmitView"

function App() {
  const [view, setView] = useState("submit")
  const [threadId, setThreadId] = useState(null)
  const [findings, setFindings] = useState([])

  const handleSubmit = (threadId) => {
    setThreadId(threadId)
    setView("pending")
}

  return (
    <div>
      {view === "submit" && <SubmitView onSubmit={handleSubmit} />}
      {view === "pending" && <p>Pending View</p>}
      {view === "history" && <p>History View</p>}
    </div>
  )
}

export default App