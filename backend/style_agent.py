from models import Finding
from dotenv import load_dotenv
from openai import OpenAI
import os
import json


load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)


def run_style_agent(code: str):
    response = client.chat.completions.create(
        model="deepseek-ai/deepseek-v4-flash",
        messages=[
            {"role": "system", "content": (
                "You are a code style reviewer.\n"
                "Review this code for naming conventions, formatting, and standards compliance.\n"
                "Return a JSON list of findings.\n"
                "Each finding must have: severity, line_number, suggestion.\n"
                "Severity must be one of: LOW, MEDIUM, HIGH, CRITICAL.\n"
                "Return JSON only. No explanation. No extra text."
            )},
            {"role": "user", "content": code}
        ],
        temperature=0.2,
        max_tokens=1000,
        stream=False
    )
    response_text = response.choices[0].message.content
    response_text = response_text.strip().strip("```json").strip("```").strip()
    data = json.loads(response_text)
    findings = [Finding(**item) for item in data]
    return findings

   

