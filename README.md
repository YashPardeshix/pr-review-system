# PR Review System

A multi-agent code review system with human-in-the-loop approval built on LangGraph. Three AI agents review code simultaneously. A supervisor aggregates findings. If any finding is HIGH or CRITICAL severity, the graph pauses and waits for human approval before finalizing.

Tested on 10 real open source GitHub PRs.

## Architecture

```
React Dashboard (Vite + Tailwind)
      ↕
FastAPI Backend
      ↕
LangGraph StateGraph
   ├── Code Quality Agent  ─┐
   ├── Security Agent      ─┼─ parallel fan-out
   ├── Style Agent         ─┘
   ├── Supervisor Node (severity threshold + HITL trigger)
   └── interrupt() — pauses graph, saves state to SqliteSaver
      ↕
SqliteSaver (checkpoint storage — graph resume)
      ↕
MongoDB (completed review history)
```

## How It Works

1. User submits code via the React dashboard
2. Three AI agents run in parallel — Code Quality, Security, Style
3. Each agent returns structured Pydantic findings with severity levels
4. Supervisor aggregates findings and checks severity threshold
5. If any finding is HIGH or CRITICAL — `interrupt()` fires, graph pauses
6. State is saved to SqliteSaver with a thread ID
7. Human reviewer sees the findings and clicks Approve or Reject
8. FastAPI sends the decision to the waiting graph
9. Graph resumes from checkpoint — no restart, no data loss
10. Completed review saved to MongoDB

## Key Technical Concept

This project demonstrates **stateful multi-agent orchestration with human oversight**.

The graph genuinely pauses mid-execution using LangGraph's `interrupt()`. State is saved to SqliteSaver identified by thread ID. The graph resumes from exactly where it stopped when the human approves — not from the beginning.

This is the pattern that separates developers who have used LangGraph from developers who understand production agentic systems.

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Agent orchestration | LangGraph | StateGraph, interrupt, checkpoint mechanics |
| LLM | DeepSeek V4 Flash via NVIDIA | Fast, free inference endpoint, optimized for coding |
| Structured output | Pydantic | Machine-readable findings for supervisor aggregation |
| Checkpoint storage | SqliteSaver | Lightweight persistence for graph resume |
| Backend | FastAPI | Fast Python API, auto-generates docs |
| Frontend | React + Vite + Tailwind | Modern stack, dark theme dashboard |
| Review history | MongoDB Atlas | Persistent completed review storage |

## Project Structure

```
pr-review-system/
├── backend/
│   ├── state.py              — LangGraph ReviewState definition
│   ├── models.py             — Pydantic Finding model
│   ├── graph.py              — LangGraph StateGraph with interrupt
│   ├── security_agent.py     — Security review agent (LLM call)
│   ├── code_quality_agent.py — Code quality review agent
│   ├── style_agent.py        — Style review agent
│   ├── main.py               — FastAPI backend (2 endpoints)
│   └── run.py                — Graph runner for local testing
└── frontend/
    └── src/
        ├── App.jsx           — Main app with navigation
        ├── SubmitView.jsx    — Code submission interface
        ├── PendingView.jsx   — Findings display + approve/reject
        └── HistoryView.jsx   — Completed review history
```

## Running Locally

### Backend

```bash
cd backend
uvicorn main:app --reload
```

Requires a `.env` file in the backend folder:

```
NVIDIA_API_KEY=your_nvidia_api_key
MONGODB_URI=your_mongodb_connection_string
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/review` | Submit code, starts LangGraph agents |
| POST | `/approve` | Send human decision, resumes graph |
| GET | `/history` | Fetch all completed reviews |

## Build Progress

- [x] Phase 1 — LangGraph interrupt and checkpoint mechanics
- [x] Step 1 — Graph skeleton with verified interrupt
- [x] Step 2 — Security Agent with real structured LLM output
- [x] Step 3 — Code Quality Agent and Style Agent (parallel)
- [x] Step 4 — Supervisor Node with severity threshold
- [x] Step 5 — FastAPI backend with two endpoints
- [x] Step 6 — React dashboard with dark theme
- [x] Step 7 — Tested on 10 real GitHub PRs
- [x] Step 8 — README file

## Known Limitations

- No authentication on API endpoints — production deployment would require API key auth at minimum
- SqliteSaver checkpoint file is local — not suitable for multi-instance deployment
- Duplicate findings possible when multiple agents flag the same issue.