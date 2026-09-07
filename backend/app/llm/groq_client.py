from groq import Groq

from app.core.config import settings


_client = None


def get_groq_client() -> Groq:
    global _client

    if _client is None:
        _client = Groq(
            api_key=settings.groq_api_key,
        )

    return _client


def generate_answer(
    prompt: str,
    model: str = "openai/gpt-oss-20b",
) -> str:
    """
    Generate an answer using the Groq LLM.
    """

    client = get_groq_client()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI assistant for AyurakshaIP. "
                    "Answer only using the provided document context. "
                    "Do not invent information."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content or ""