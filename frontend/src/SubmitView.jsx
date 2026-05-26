import { useState } from "react"
import axios from "axios"

function SubmitView({ onSubmit }) {
  const [code, setCode] = useState("")

  const handleSubmit = async () => {
    const response = await axios.post("http://127.0.0.1:8000/review", {
      code: code
    })
    onSubmit(response.data.thread_id)
  }

  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
      />
      <button onClick={handleSubmit}>Submit for Review</button>
    </div>
  )
}

export default SubmitView