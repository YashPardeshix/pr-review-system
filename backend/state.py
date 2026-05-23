from typing import TypedDict, Annotated
import operator

class ReviewState(TypedDict):
    code: str
    findings: Annotated[list, operator.add]
    human_decision: str
    final_review:str

