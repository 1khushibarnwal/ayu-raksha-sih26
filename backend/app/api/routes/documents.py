
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.rag.ingest import create_document_chunks
from app.rag.store import generate_embeddings, serialize_embedding


router = APIRouter(
    prefix="/api/v1/documents",
    tags=["Documents"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("")
async def upload_document(
    file: UploadFile,
    db: Session = Depends(get_db),
):
    """
    Upload a PDF, save the file, extract its text,
    create chunks, generate embeddings, and persist
    everything in the database.
    """

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided.",
        )

    original_filename = file.filename
    extension = Path(original_filename).suffix.lower()

    if extension != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Currently only PDF files are supported.",
        )

    document_id = str(uuid4())

    stored_filename = f"{document_id}{extension}"
    file_path = UPLOAD_DIR / stored_filename

    try:
        # 1. Save uploaded file
        file_size = 0

        with open(file_path, "wb") as output_file:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                output_file.write(chunk)
                file_size += len(chunk)

        # 2. Create document record
        document = Document(
            id=document_id,
            filename=stored_filename,
            original_filename=original_filename,
            file_path=str(file_path),
            mime_type=file.content_type or "application/pdf",
            file_size=file_size,
            status="processing",
        )

        db.add(document)
        db.flush()

        # 3. Extract text and create chunks
        chunks = create_document_chunks(
            str(file_path)
        )

        # 4. Generate embeddings
        texts = [
            chunk["chunk_text"]
            for chunk in chunks
        ]

        embeddings = generate_embeddings(texts)

        # 5. Save chunks and embeddings
        for chunk, embedding in zip(
            chunks,
            embeddings,
        ):
            document_chunk = DocumentChunk(
                id=str(uuid4()),
                document_id=document_id,
                page_number=chunk["page_number"],
                chunk_index=chunk["chunk_index"],
                chunk_text=chunk["chunk_text"],
                embedding=serialize_embedding(
                    embedding
                ),
            )

            db.add(document_chunk)

        # 6. Mark document as processed
        document.status = "processed"

        db.commit()

        return {
            "document_id": document_id,
            "filename": original_filename,
            "stored_filename": stored_filename,
            "file_size": file_size,
            "chunks_created": len(chunks),
            "embeddings_created": len(embeddings),
            "status": "processed",
        }

    except Exception as exc:
        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(exc)}",
        )

    finally:
        await file.close()


@router.get("/{document_id}")
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
):
    """
    Get information about a stored document.
    """

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    chunk_count = (
        db.query(DocumentChunk)
        .filter(
            DocumentChunk.document_id == document_id
        )
        .count()
    )

    return {
        "document_id": document.id,
        "filename": document.original_filename,
        "stored_filename": document.filename,
        "file_path": document.file_path,
        "mime_type": document.mime_type,
        "file_size": document.file_size,
        "status": document.status,
        "chunks_created": chunk_count,
        "created_at": document.created_at,
    }

