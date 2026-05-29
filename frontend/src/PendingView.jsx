import axios from "axios"

function PendingView({ threadId, onApprove }) {
  
    const handleDecision = async (decision) => {
        await axios.post("http://127.0.0.1:8000/approve", {
            thread_id: threadId,
            decision: decision
        })
        onApprove()
    }
  
    return (
      <div>
        <p>Review ID: {threadId}</p>
        <button onClick={() => handleDecision("approved")}>Approve</button>
        <button onClick={() => handleDecision("rejected")}>Reject</button>
      </div>
    )
  }

  export default PendingView