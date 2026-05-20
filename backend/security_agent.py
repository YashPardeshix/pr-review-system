from models import Finding
from dotenv import load_dotenv
from openai import OpenAI
import os


load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)