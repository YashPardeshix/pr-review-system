from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import graph
from pymongo import MongoClient
import uuid
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["pr_review_system"]
reviews_collection = db["reviews"]

class CodeSubmission(BaseModel):
    code: str

class ApprovalDecision(BaseModel):
    thread_id: str
    decision: str

@app.post("/review")
def review(submission: CodeSubmission):
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    result = graph.invoke({"code": submission.code}, config)
    findings = [f.dict() for f in result.get("findings", [])]
    return {"thread_id": thread_id, "status": "pending", "findings": findings}

@app.post("/approve")
def approve(decision: ApprovalDecision):
    thread_id = decision.thread_id
    config = {"configurable": {"thread_id": thread_id}}
    graph.invoke(None, config)
    reviews_collection.insert_one({
        "thread_id": thread_id,
        "decision": decision.decision,
        "timestamp": datetime.utcnow().isoformat(),  
    })
    return {"thread_id": thread_id, "status": decision.decision}

@app.get("/history")
def history():
    reviews = list(reviews_collection.find({}, {"_id": 0}))
    return {"reviews": reviews}