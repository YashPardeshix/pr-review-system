import { useState, useEffect } from "react"
import axios from "axios"

function HistoryView() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/history")
      .then(res => setReviews(res.data.reviews))
  }, [])

  return (
    <div className="pt-24 px-6 max-w-4xl mx-auto">
      <div className="border-b border-outline-variant pb-4 mb-8">
        <h2 className="text-3xl font-bold text-on-surface">Review History</h2>
        <p className="text-sm text-on-surface-variant mt-1">All completed reviews.</p>
      </div>
      <div className="flex flex-col gap-3">
        {reviews.map((review, index) => (
          <div key={index} className="bg-surface-container-high border border-outline-variant rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-mono text-sm text-on-surface">{review.thread_id}</div>
              <div className="text-xs text-on-surface-variant mt-1">{review.timestamp}</div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${review.decision === "approved" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {review.decision}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryView