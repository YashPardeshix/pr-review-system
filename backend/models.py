from pydantic import BaseModel

class Finding(BaseModel):
    severity: str
    line_number: int
    suggestion: str