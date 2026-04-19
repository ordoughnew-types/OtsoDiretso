# safety/detector.py
#
# This module is responsible for detecting emotional distress
# in user messages before they reach the LLM.
#
# Based on your thesis paper, the safety check evaluates messages
# for indicators of extreme emotional distress like severe sadness,
# hopelessness, or self-harm expressions. If detected, the message
# is flagged so the LLM responds with safe, non-directive,
# emotionally supportive language instead of general responses.

# Keywords and phrases associated with crisis or high distress
# These are grouped by category for easier maintenance and expansion
# Your CCW validators may want to review and expand this list later

CRISIS_KEYWORDS = [
    # Self-harm indicators
    "kill myself", "end my life", "want to die", "suicide",
    "self harm", "self-harm", "hurt myself", "cut myself",
    "overdose", "don't want to live", "no reason to live",

    # Hopelessness indicators
    "hopeless", "worthless", "no point", "give up",
    "can't go on", "cannot go on", "nothing matters",
    "no one cares", "better off without me",

    # Severe distress indicators
    "can't take it anymore", "cannot take it anymore",
    "breaking down", "falling apart", "losing my mind",
]

# Moderate distress keywords — chatbot responds with extra empathy
# but does not trigger the full crisis protocol
MODERATE_KEYWORDS = [
    "anxious", "anxiety", "depressed", "depression",
    "stressed", "stress", "overwhelmed", "exhausted",
    "lonely", "alone", "sad", "crying", "helpless",
    "scared", "afraid", "worried", "nervous", "panic",
    "can't sleep", "cannot sleep", "no motivation",
    "failing", "disappointed", "frustrated",
]


def detect_risk_level(message: str) -> str:
    """
    Analyzes a message and returns a risk level string.

    Returns:
        "crisis"   — message contains self-harm or severe distress language
        "moderate" — message contains emotional distress language
        "safe"     — no distress indicators detected

    Why three levels instead of just crisis/safe?
    Having a moderate level lets the chatbot gradually increase
    empathy without immediately escalating every mention of stress
    or anxiety to a crisis response — which would feel unnatural
    and potentially dismiss the user's feelings.
    """
    # Convert to lowercase for case-insensitive matching
    message_lower = message.lower()

    # Check crisis keywords first — highest priority
    for keyword in CRISIS_KEYWORDS:
        if keyword in message_lower:
            return "crisis"

    # Check moderate keywords second
    for keyword in MODERATE_KEYWORDS:
        if keyword in message_lower:
            return "moderate"

    # No distress indicators found
    return "safe"


def build_safe_prompt(message: str, risk_level: str) -> str:
    """
    Wraps the user message in a system prompt that guides
    the LLM to respond appropriately based on the risk level.

    Why do we modify the prompt instead of blocking the message?
    Blocking would leave the user without support at the moment
    they need it most. Instead, we guide the LLM to respond
    safely and empathetically while encouraging professional help.

    Note: These system prompts will be used once the actual
    LLaMA 3.1 8B model is integrated. For now they are prepared
    and returned for future use.
    """

    if risk_level == "crisis":
        system_prompt = """You are a compassionate emotional support assistant 
        for university students. The user may be experiencing a crisis. 
        Respond with warmth, validate their feelings, and gently encourage 
        them to reach out to a counselor or crisis hotline. 
        Do NOT provide advice, instructions, or solutions. 
        Focus only on emotional validation and safety."""

    elif risk_level == "moderate":
        system_prompt = """You are a compassionate emotional support assistant 
        for university students. The user is experiencing emotional distress. 
        Respond with empathy, acknowledge their feelings, and provide 
        gentle non-directive support. Do not diagnose or prescribe solutions."""

    else:
        system_prompt = """You are a compassionate emotional support assistant 
        for university students. Listen actively, respond with empathy, 
        and provide supportive non-directive responses."""

    return f"{system_prompt}\n\nStudent: {message}"