from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import graph
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeSubmission(BaseModel):
    code: str

class ApprovalDecision(BaseModel):
    thread_id: str
    decision: str


@app.post("/review")
def review(submission: CodeSubmission):
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    graph.invoke({"code": submission.code}, config)
    return {"thread_id": thread_id, "status": "pending"}


@app.post("/approve")
def approve(decision: ApprovalDecision):
    thread_id = decision.thread_id
    config = {"configurable": {"thread_id": thread_id}}
    graph.invoke(None, config)
    return {"thread_id": thread_id, "status": "approved"}