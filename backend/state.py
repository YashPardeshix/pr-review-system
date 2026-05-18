from typing import TypedDict

class ReviewState(TypedDict):
    code: str
    findings: list
    human_decision: str
    final_review:str

