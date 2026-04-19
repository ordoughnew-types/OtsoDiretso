from fastapi import FastAPI
from pydantic import BaseModel
from safety.detector import detect_risk_level, build_safe_prompt

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "AI service working"}


class Message(BaseModel):
    message: str


@app.post("/chat")
def chat(data: Message):
    """
    Main chat endpoint.

    Flow:
    1. Receive message from Laravel
    2. Run safety detection on the message
    3. Build an appropriate prompt based on risk level
    4. (Later) Send prompt to LLaMA 3.1 8B and return response
    5. For now, return echo response only — risk_level and
       prepared_prompt are used internally and never exposed
       to the user
    """

    # Step 1 — Detect risk level internally
    # This is never sent back to the user
    risk_level = detect_risk_level(data.message)

    # Temporary print for development testing only
    # Remove this before deployment
    print(f"[SAFETY] Message: '{data.message}' | Risk Level: {risk_level}")


    # Step 2 — Build safe prompt based on risk level
    # This will be passed to the LLM once integrated
    # For now it is prepared but not yet used
    safe_prompt = build_safe_prompt(data.message, risk_level)

    # Step 3 — Return only the reply to Laravel
    # risk_level and safe_prompt stay internal
    # Once LLM is integrated, safe_prompt will be sent
    # to the model and the actual response returned here
    return {
        "reply": f"You said: {data.message}",
        
    }
