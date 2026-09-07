from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.assessment import Assessment


router = APIRouter(
    prefix="/api/v1/assessments",
    tags=["Assessments"],
)


class AssessmentCreate(BaseModel):
    title: str
    description: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("")
def create_assessment(
    data: AssessmentCreate,
    db: Session = Depends(get_db),
):
    assessment = Assessment(
        title=data.title,
        description=data.description,
        status="created",
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "assessment_id": assessment.id,
        "status": assessment.status,
        "title": assessment.title,
    }


@router.get("/{assessment_id}")
def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
):
    assessment = db.get(Assessment, assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found",
        )

    return {
        "assessment_id": assessment.id,
        "status": assessment.status,
        "title": assessment.title,
        "description": assessment.description,
        "created_at": assessment.created_at,
        "updated_at": assessment.updated_at,
    }