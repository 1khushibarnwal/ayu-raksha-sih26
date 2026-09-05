from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


class ChatRequest(BaseModel):
    message: str
    assessment_id: str | None = None


@router.post("")
def chat(request: ChatRequest):
    return {
        "message": request.message,
        "answer": "AI response will be connected here.",
        "sources": [],
        "assessment_id": request.assessment_id,
    }