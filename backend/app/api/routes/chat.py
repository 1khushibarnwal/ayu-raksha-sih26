from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.rag.retriever import retrieve_chunks
from app.llm.groq_client import generate_answer


router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    message: str
    assessment_id: str | None = None


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def calculate_confidence(
    retrieved_chunks: list[dict],
) -> float:
    """
    Calculate confidence using the highest
    relevance score among retrieved chunks.
    """

    if not retrieved_chunks:
        return 0.0

    best_score = max(
        chunk["relevance_score"]
        for chunk in retrieved_chunks
    )

    confidence = max(
        0.0,
        min(best_score, 1.0),
    )

    return round(confidence, 4)


def build_llm_prompt(
    question: str,
    retrieved_chunks: list[dict],
) -> str:
    """
    Build the prompt that will be sent to the LLM.
    """

    context_parts = []

    for index, chunk in enumerate(
        retrieved_chunks,
        start=1,
    ):
        context_parts.append(
            f"""
[Source {index}]
Document: {chunk["filename"]}
Page: {chunk["page_number"]}
Chunk: {chunk["chunk_index"]}

Content:
{chunk["chunk_text"]}
""".strip()
        )

    context = "\n\n".join(context_parts)

    prompt = f"""
You are an AI assistant for AyurakshaIP.

Answer the user's question using ONLY the provided
document context.

If the answer cannot be found in the provided context,
clearly say that the available documents do not contain
enough information to answer the question.

Do not invent facts or information.

When using information from the context, mention the
relevant document name and page number.

User question:
{question}

Relevant document context:
{context}

Provide a clear and concise answer.
""".strip()

    return prompt


@router.post("")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    Retrieve relevant document chunks,
    build the LLM prompt, and generate an answer.
    """

    # 1. Validate question
    if not request.message.strip():
        return {
            "message": request.message,
            "answer": "Please enter a question.",
            "context": [],
            "sources": [],
            "confidence": 0.0,
            "assessment_id": request.assessment_id,
        }

    # 2. Get persisted chunks that have embeddings
    db_chunks = (
        db.query(DocumentChunk)
        .filter(
            DocumentChunk.embedding.isnot(None)
        )
        .all()
    )

    # 3. Convert database records into dictionaries
    chunks = []

    for chunk in db_chunks:
        document = (
            db.query(Document)
            .filter(
                Document.id == chunk.document_id
            )
            .first()
        )

        if document is None:
            continue

        chunks.append(
            {
                "id": chunk.id,
                "document_id": chunk.document_id,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
                "chunk_text": chunk.chunk_text,
                "embedding": chunk.embedding,
                "filename": document.original_filename,
            }
        )

    # 4. Retrieve the most relevant chunks
    retrieved_chunks = retrieve_chunks(
        query=request.message,
        chunks=chunks,
        top_k=5,
    )

    # 5. Calculate confidence
    confidence = calculate_confidence(
        retrieved_chunks
    )

    # 6. Build source information
    sources = []

    for chunk in retrieved_chunks:
        sources.append(
            {
                "document_id": chunk["document_id"],
                "filename": chunk["filename"],
                "page": chunk["page_number"],
                "chunk": chunk["chunk_index"],
                "relevance_score": chunk["relevance_score"],
            }
        )

    # 7. Build LLM prompt
    llm_prompt = build_llm_prompt(
        question=request.message,
        retrieved_chunks=retrieved_chunks,
    )

    # 8. Prepare context for API response
    context = []

    for chunk in retrieved_chunks:
        context.append(
            {
                "document_id": chunk["document_id"],
                "filename": chunk["filename"],
                "page": chunk["page_number"],
                "chunk": chunk["chunk_index"],
                "text": chunk["chunk_text"],
                "relevance_score": chunk["relevance_score"],
            }
        )

    # 9. Generate answer using Groq
    answer = "No AI response generated."

    if retrieved_chunks:
        try:
            answer = generate_answer(
                llm_prompt
            )

        except Exception:
            answer = (
                "The AI service is currently unavailable."
                "Please configure the Groq API key."
            )

    # 10. Return final response
    return {
        "message": request.message,
        "answer": answer,
        "context": context,
        "sources": sources,
        "confidence": confidence,
        "llm_prompt": llm_prompt,
        "assessment_id": request.assessment_id,
    }