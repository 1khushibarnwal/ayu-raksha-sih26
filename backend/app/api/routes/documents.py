from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/api/v1/documents", tags=["Documents"])


class DocumentCreate(BaseModel):
    filename: str
    document_type: str


@router.post("")
def create_document(data: DocumentCreate):
    document_id = str(uuid4())

    return {
        "document_id": document_id,
        "filename": data.filename,
        "status": "uploaded",
    }


@router.get("/{document_id}")
def get_document(document_id: str):
    return {
        "document_id": document_id,
        "status": "processing",
    }