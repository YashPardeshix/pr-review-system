import axios from "axios"

const severityConfig = {
  CRITICAL: { border: "border-error-container", badge: "bg-error-container text-on-error-container" },
  HIGH: { border: "border-tertiary-container", badge: "bg-tertiary-container text-on-tertiary-container" },
  MEDIUM: { border: "border-secondary-container", badge: "bg-secondary-container text-on-secondary-container" },
  LOW: { border: "border-outline-variant", badge: "bg-surface-container text-on-surface-variant" },
}

const barColor = {
  CRITICAL: "#ffb4ab",
  HIGH: "#ffb786",
  MEDIUM: "#b9c8de",
  LOW: "#adc6ff",
}

function PendingView({ threadId, findings, onApprove }) {

  const handleDecision = async (decision) => {
    await axios.post("http://127.0.0.1:8000/approve", {
      thread_id: threadId,
      decision: decision
    })
    onApprove()
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      <div className="border-b border-outline-variant pb-4 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-on-surface">Pending Review</h2>
          <p className="text-sm text-on-surface-variant mt-1">Review ID: {threadId}</p>
        </div>
      </div>

      <p className="text-on-surface-variant text-sm mb-6">
        Agents have completed their analysis. Review the findings below and make your decision.
      </p>

      <div className="flex flex-col gap-4">
        {findings.map((finding, index) => {
          const config = severityConfig[finding.severity] || severityConfig.LOW
          return (
            <article key={index} className={`bg-surface-container border ${config.border} rounded-lg p-4 relative overflow-hidden`}>
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: barColor[finding.severity] || "#adc6ff" }}
              ></div>
              <div className="flex items-center gap-3 mb-3 pl-2">
                <span className={`${config.badge} text-xs font-bold px-2 py-1 rounded uppercase tracking-wider`}>
                  {finding.severity}
                </span>
                <span className="font-mono text-xs text-on-surface-variant bg-surface px-2 py-1 rounded border border-outline-variant">
                  Line {finding.line_number}
                </span>
              </div>
              <p className="text-on-surface text-sm pl-2">{finding.suggestion}</p>
            </article>
          )
        })}
      </div>

      <footer className="fixed bottom-0 left-0 w-full bg-surface-container border-t border-outline-variant py-4 px-6 z-40">
        <div className="max-w-4xl mx-auto flex justify-end gap-4 items-center">
          <span className="text-sm text-on-surface-variant mr-auto">Human approval required</span>
          <button
            onClick={() => handleDecision("rejected")}
            className="px-6 py-2 rounded bg-error text-on-error font-semibold hover:opacity-90 transition-opacity"
          >
            Reject
          </button>
          <button
            onClick={() => handleDecision("approved")}
            className="px-6 py-2 rounded bg-primary-container text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Approve
          </button>
        </div>
      </footer>
    </div>
  )
}

export default PendingView