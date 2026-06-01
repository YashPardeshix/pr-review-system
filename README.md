# PR Review System

A multi-agent code review system with human-in-the-loop approval built on LangGraph.

## What This Project Does

Three AI agents review code simultaneously. A supervisor aggregates their findings. If any finding is HIGH or CRITICAL severity, the system pauses and waits for a human to approve or reject before finalizing the review.

## Architecture

```
React Dashboard
      ↕
FastAPI Backend
      ↕
LangGraph StateGraph
   ├── Code Quality Agent
   ├── Security Agent
   ├── Style Agent
   ├── Supervisor Node
   └── HITL Interrupt (pauses for human approval)
      ↕
SqliteSaver (checkpoint storage)
      ↕
MongoDB (completed review storage)
```

## Tech Stack

- **LangGraph** — StateGraph, interrupt, and checkpoint mechanics
- **Python** — all agent logic and backend
- **Pydantic** — structured agent outputs
- **SqliteSaver** — checkpoint persistence for graph resume
- **FastAPI** — API layer (in progress)
- **React + Tailwind** — human approval dashboard (in progress)
- **MongoDB** — completed review history (in progress)
- **DeepSeek V4 Flash via NVIDIA** — LLM for all three agents

## Project Structure

```
pr-review-system/
└── backend/
    ├── state.py          — LangGraph state definition
    ├── models.py         — Pydantic Finding model
    ├── graph.py          — LangGraph StateGraph with interrupt
    ├── security_agent.py — Security review agent (LLM call)
    └── run.py            — Graph runner for testing
```

## Build Progress

- [x] Phase 1 — LangGraph interrupt and checkpoint mechanics
- [x] Step 1 — Graph skeleton with verified interrupt
- [x] Step 2 — Security Agent with real LLM output (in progress)
- [ ] Step 3 — Code Quality Agent and Style Agent
- [ ] Step 4 — Supervisor Node with severity threshold
- [ ] Step 5 — FastAPI backend
- [ ] Step 6 — React dashboard
- [ ] Step 7 — Test on 10 real GitHub PRs
- [ ] Step 8 — Architecture diagram and Loom demo

## Key Technical Concept

This project demonstrates **stateful multi-agent orchestration with human oversight** — the graph genuinely pauses mid-execution using LangGraph's `interrupt()`, saves state to SqliteSaver with a thread ID, and resumes from exactly where it stopped when the human approves.

## Running Locally

```bash
cd backend
python3 run.py
```

Requires a `.env` file in the backend folder:

```
NVIDIA_API_KEY=your_key_here
```