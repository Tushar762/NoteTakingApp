import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate, NoteOut, TagCreate, TagOut
from app.services.auth import get_current_user
from app.services import notes as note_service

router = APIRouter(prefix="/api", tags=["Notes & Tags"])


# ---- Notes ----

@router.get("/notes", response_model=List[NoteOut])
def list_notes(
    search: Optional[str] = Query(None),
    tag_id: Optional[uuid.UUID] = Query(None),
    archived: bool = Query(False),
    pinned: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.get_notes(db, current_user, search, tag_id, archived, pinned)


@router.post("/notes", response_model=NoteOut, status_code=201)
def create_note(
    payload: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.create_note(db, payload, current_user)


@router.get("/notes/{note_id}", response_model=NoteOut)
def get_note(
    note_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.get_note(db, note_id, current_user)


@router.put("/notes/{note_id}", response_model=NoteOut)
def update_note(
    note_id: uuid.UUID,
    payload: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.update_note(db, note_id, payload, current_user)


@router.delete("/notes/{note_id}", status_code=204)
def delete_note(
    note_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note_service.delete_note(db, note_id, current_user)


@router.patch("/notes/{note_id}/pin", response_model=NoteOut)
def toggle_pin(
    note_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.toggle_pin(db, note_id, current_user)


@router.patch("/notes/{note_id}/archive", response_model=NoteOut)
def toggle_archive(
    note_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.toggle_archive(db, note_id, current_user)


# ---- Tags ----

@router.get("/tags", response_model=List[TagOut])
def list_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.get_tags(db, current_user)


@router.post("/tags", response_model=TagOut, status_code=201)
def create_tag(
    payload: TagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return note_service.create_tag(db, payload.name, payload.color, current_user)


@router.delete("/tags/{tag_id}", status_code=204)
def delete_tag(
    tag_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    note_service.delete_tag(db, tag_id, current_user)
