import json
import re
import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from anthropic import Anthropic

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    scenario: str | None = None  # cafe, airport, interview, shopping
    conversation_history: list[ChatMessage] = []


class CorrectionDetail(BaseModel):
    original: str
    corrected: str
    explanation: str


class ChatResponse(BaseModel):
    reply: str
    corrections: list[CorrectionDetail] = []
    suggestions: list[str] = []


class CorrectionRequest(BaseModel):
    sentence: str


class CorrectionResponse(BaseModel):
    corrected: str
    corrections: list[CorrectionDetail] = []
    is_correct: bool = False


# ---------------------------------------------------------------------------
# Scenario system prompts
# ---------------------------------------------------------------------------

SCENARIO_PROMPTS: dict[str, str] = {
    "cafe": (
        "You are a friendly barista at a cozy cafe. Speak naturally but simply, "
        "using common expressions people would use when ordering coffee and food. "
        "Help the user practice ordering drinks, asking about the menu, and making small talk. "
        "Keep your responses concise and realistic to a real cafe interaction."
    ),
    "airport": (
        "You are an airline check-in agent at an international airport. "
        "Help the user practice checking in for a flight, asking about baggage, "
        "seat selection, boarding gates, and flight delays. "
        "Use polite and professional language typical of airport staff."
    ),
    "interview": (
        "You are an interviewer at a tech company conducting a job interview. "
        "Ask the user professional questions about their experience, skills, and goals. "
        "Give feedback on how their answers sound and suggest improvements. "
        "Be encouraging but professional."
    ),
    "shopping": (
        "You are a helpful store clerk at a clothing shop. "
        "Help the user practice asking about sizes, colors, prices, trying on clothes, "
        "and making purchases. Be friendly and attentive like a real store assistant."
    ),
}

DEFAULT_PROMPT = (
    "You are a friendly English conversation partner for Korean learners. "
    "Have natural, engaging conversations on any topic the user wants to discuss. "
    "Adjust your vocabulary and sentence complexity to match the user's level."
)

CORRECTION_INSTRUCTIONS = """

IMPORTANT INSTRUCTIONS FOR EVERY RESPONSE:
1. First, reply naturally to continue the conversation in character.
2. If the user's English has any grammar mistakes, unnatural expressions, or could be improved, provide corrections.
3. At the very end of your response, if there are corrections, include a JSON block in the following exact format (and ONLY if there are corrections):

```json
{
  "corrections": [
    {
      "original": "the user's original phrase",
      "corrected": "the improved version",
      "explanation": "한국어로 설명 (explain in Korean why this is better)"
    }
  ],
  "suggestions": ["대안 표현 1 (alternative way to say it)", "대안 표현 2"]
}
```

4. The "explanation" field MUST be written in Korean (한국어).
5. The "suggestions" field should contain 1-3 alternative ways the user could express their message, written in English.
6. If the user's English is perfect, do NOT include the JSON block.
7. Adjust your difficulty level to match the user's English proficiency - if they use simple English, keep yours simple too. If they're advanced, be more sophisticated.
8. Keep your conversational reply and the JSON block clearly separated.
"""


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _build_system_prompt(scenario: str | None) -> str:
    base = SCENARIO_PROMPTS.get(scenario or "", DEFAULT_PROMPT)
    return base + CORRECTION_INSTRUCTIONS


def _parse_response(raw_text: str) -> ChatResponse:
    """Parse the Claude response, extracting JSON corrections if present."""
    corrections: list[CorrectionDetail] = []
    suggestions: list[str] = []
    reply = raw_text

    # Try to find a JSON block in the response
    json_pattern = r"```json\s*(\{[\s\S]*?\})\s*```"
    match = re.search(json_pattern, raw_text)

    if match:
        # Remove the JSON block from the reply
        reply = raw_text[:match.start()].rstrip()
        try:
            data = json.loads(match.group(1))
            if "corrections" in data:
                for c in data["corrections"]:
                    corrections.append(CorrectionDetail(
                        original=c.get("original", ""),
                        corrected=c.get("corrected", ""),
                        explanation=c.get("explanation", ""),
                    ))
            if "suggestions" in data:
                suggestions = data["suggestions"]
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            logger.warning("Failed to parse corrections JSON: %s", e)
    else:
        # Also try to find raw JSON (without code fences)
        raw_json_pattern = r'\{\s*"corrections"\s*:\s*\[[\s\S]*?\]\s*(?:,\s*"suggestions"\s*:\s*\[[\s\S]*?\])?\s*\}'
        match2 = re.search(raw_json_pattern, raw_text)
        if match2:
            reply = raw_text[:match2.start()].rstrip()
            try:
                data = json.loads(match2.group(0))
                if "corrections" in data:
                    for c in data["corrections"]:
                        corrections.append(CorrectionDetail(
                            original=c.get("original", ""),
                            corrected=c.get("corrected", ""),
                            explanation=c.get("explanation", ""),
                        ))
                if "suggestions" in data:
                    suggestions = data["suggestions"]
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                logger.warning("Failed to parse raw corrections JSON: %s", e)

    return ChatResponse(reply=reply, corrections=corrections, suggestions=suggestions)


def _get_demo_response(message: str, scenario: str | None) -> ChatResponse:
    """Return a demo response when no API key is configured."""
    demo_replies = {
        "cafe": (
            "Welcome to our cafe! What can I get for you today? "
            "We have a great selection of coffee and pastries.\n\n"
            "(카페에 오신 걸 환영해요! 오늘 뭘 드릴까요?)"
        ),
        "airport": (
            "Good morning! Welcome to the check-in counter. "
            "May I see your passport and booking confirmation, please?\n\n"
            "(안녕하세요! 체크인 카운터에 오신 걸 환영합니다. "
            "여권과 예약 확인서를 보여주시겠어요?)"
        ),
        "interview": (
            "Thank you for coming in today. Let's start with a brief introduction. "
            "Could you tell me about yourself and your background?\n\n"
            "(오늘 와주셔서 감사합니다. 간단한 자기소개부터 시작할까요?)"
        ),
        "shopping": (
            "Hi there! Welcome to our store. Are you looking for anything in particular? "
            "We have some great new arrivals this week!\n\n"
            "(안녕하세요! 저희 매장에 오신 걸 환영해요. "
            "찾으시는 게 있으신가요? 이번 주 신상품이 많이 들어왔어요!)"
        ),
    }

    default_reply = (
        "That's great! Your English is really improving. "
        "Let me help you with a more natural way to say that...\n\n"
        "(잘하고 있어요! 좀 더 자연스러운 표현을 알려드릴게요.)"
    )

    reply = demo_replies.get(scenario or "", default_reply)

    # Provide sample corrections for demo
    corrections = [
        CorrectionDetail(
            original="I want coffee",
            corrected="I'd like a coffee, please.",
            explanation='"want"보다 "I\'d like"가 더 정중한 표현이에요. 또한 음료 앞에 관사 "a"를 붙여야 해요.',
        )
    ]
    suggestions = [
        "Could I get a coffee, please?",
        "May I have a coffee?",
    ]

    return ChatResponse(reply=reply, corrections=corrections, suggestions=suggestions)


def _get_demo_correction(sentence: str) -> CorrectionResponse:
    """Return a demo correction when no API key is configured."""
    return CorrectionResponse(
        corrected=sentence,
        corrections=[
            CorrectionDetail(
                original=sentence,
                corrected=sentence + " (데모 모드)",
                explanation="API 키가 설정되지 않아 데모 응답을 반환합니다.",
            )
        ],
        is_correct=False,
    )


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/", response_model=ChatResponse)
async def create_chat(req: ChatRequest):
    """Send a message and get an AI response with corrections."""

    # Graceful degradation: return demo response if no API key
    if not settings.ANTHROPIC_API_KEY:
        return _get_demo_response(req.message, req.scenario)

    try:
        client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        # Build messages list from conversation history
        messages = []
        for msg in req.conversation_history:
            messages.append({
                "role": msg.role,
                "content": msg.content,
            })

        # Add the current user message
        messages.append({
            "role": "user",
            "content": req.message,
        })

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=_build_system_prompt(req.scenario),
            messages=messages,
        )

        raw_text = response.content[0].text
        return _parse_response(raw_text)

    except Exception as e:
        logger.error("Claude API error: %s", e)
        # Fallback to demo response on API failure
        return _get_demo_response(req.message, req.scenario)


@router.post("/correct", response_model=CorrectionResponse)
async def correct_sentence(req: CorrectionRequest):
    """Correct a single sentence - for quick feedback."""

    if not settings.ANTHROPIC_API_KEY:
        return _get_demo_correction(req.sentence)

    try:
        client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        system_prompt = (
            "You are an English grammar and expression correction assistant for Korean learners. "
            "The user will provide an English sentence. Your job is to:\n"
            "1. Correct any grammar, spelling, or expression issues.\n"
            "2. Respond ONLY with a JSON object in the following format:\n\n"
            '{\n'
            '  "corrected": "the corrected sentence",\n'
            '  "is_correct": true/false,\n'
            '  "corrections": [\n'
            '    {\n'
            '      "original": "problematic part",\n'
            '      "corrected": "fixed version",\n'
            '      "explanation": "한국어로 설명"\n'
            '    }\n'
            '  ]\n'
            '}\n\n'
            "If the sentence is already correct, set is_correct to true and corrections to an empty array.\n"
            "The explanation MUST be in Korean (한국어).\n"
            "Respond with ONLY the JSON, no other text."
        )

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            system=system_prompt,
            messages=[{"role": "user", "content": req.sentence}],
        )

        raw_text = response.content[0].text.strip()

        # Try to parse JSON from the response
        # Remove code fences if present
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text)
        cleaned = re.sub(r"\s*```$", "", cleaned)

        data = json.loads(cleaned)

        corrections = []
        for c in data.get("corrections", []):
            corrections.append(CorrectionDetail(
                original=c.get("original", ""),
                corrected=c.get("corrected", ""),
                explanation=c.get("explanation", ""),
            ))

        return CorrectionResponse(
            corrected=data.get("corrected", req.sentence),
            corrections=corrections,
            is_correct=data.get("is_correct", len(corrections) == 0),
        )

    except Exception as e:
        logger.error("Claude API error in /correct: %s", e)
        return _get_demo_correction(req.sentence)


@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history."""
    return {"conversation_id": conversation_id, "messages": []}
