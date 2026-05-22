from state import ReviewState
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.types import interrupt, Command
import sqlite3
from security_agent import run_security_agent



def code_quality_node(state:ReviewState):
    return {}


def security_node(state:ReviewState):
    code = state["code"]
    findings = run_security_agent(code)
    return {"findings": findings}


def style_node(state:ReviewState):
    return {}


def supervisor_node(state:ReviewState):
    findings = state.get("findings", [])
    for finding in findings:
        if finding.severity in ["HIGH", "CRITICAL"]:
            human_decision = interrupt("Human review required")
    return {}


builder = StateGraph(ReviewState)
conn = sqlite3.connect("checkpoints.sqlite", check_same_thread=False)
checkpointer = SqliteSaver(conn)
builder.add_node("code_quality_node", code_quality_node)
builder.add_node("security_node", security_node)
builder.add_node("style_node", style_node)
builder.add_node("supervisor_node", supervisor_node)
builder.add_edge(START, "code_quality_node")
builder.add_edge(START, "security_node")
builder.add_edge(START, "style_node")
builder.add_edge("code_quality_node", "supervisor_node")
builder.add_edge("security_node", "supervisor_node")
builder.add_edge("style_node", "supervisor_node")
builder.add_edge("supervisor_node", END)


graph = builder.compile(checkpointer=checkpointer)
