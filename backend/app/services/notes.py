import uuid
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.note import Note, Tag
from app.models.user import User
from app.schemas.note import NoteCreate, NoteUpdate


# ---- Note Services ----

def get_notes(
    db: Session,
    user: User,
    search: Optional[str] = None,
    tag_id: Optional[uuid.UUID] = None,
    archived: bool = False,
    pinned: Optional[bool] = None,
) -> List[Note]:
    query = db.query(Note).filter(Note.user_id == user.id, Note.is_archived == archived)

    if pinned is not None:
        query = query.filter(Note.is_pinned == pinned)

    if search:
        query = query.filter(
            Note.title.ilike(f"%{search}%") | Note.content.ilike(f"%{search}%")
        )

    if tag_id:
        query = query.filter(Note.tags.any(Tag.id == tag_id))

    return query.order_by(Note.is_pinned.desc(), Note.updated_at.desc()).all()


def get_note(db: Session, note_id: uuid.UUID, user: User) -> Note:
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


def create_note(db: Session, data: NoteCreate, user: User) -> Note:
    tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids), Tag.user_id == user.id).all()
    note = Note(
        user_id=user.id,
        title=data.title,
        content=data.content,
        color=data.color,
        tags=tags,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, note_id: uuid.UUID, data: NoteUpdate, user: User) -> Note:
    note = get_note(db, note_id, user)

    if data.title is not None:
        note.title = data.title
    if data.content is not None:
        note.content = data.content
    if data.color is not None:
        note.color = data.color
    if data.tag_ids is not None:
        note.tags = db.query(Tag).filter(Tag.id.in_(data.tag_ids), Tag.user_id == user.id).all()

    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note_id: uuid.UUID, user: User) -> None:
    note = get_note(db, note_id, user)
    db.delete(note)
    db.commit()


def toggle_pin(db: Session, note_id: uuid.UUID, user: User) -> Note:
    note = get_note(db, note_id, user)
    note.is_pinned = not note.is_pinned
    db.commit()
    db.refresh(note)
    return note


def toggle_archive(db: Session, note_id: uuid.UUID, user: User) -> Note:
    note = get_note(db, note_id, user)
    note.is_archived = not note.is_archived
    note.is_pinned = False  # archived notes can't be pinned
    db.commit()
    db.refresh(note)
    return note


# ---- Tag Services ----

def get_tags(db: Session, user: User) -> List[Tag]:
    return db.query(Tag).filter(Tag.user_id == user.id).order_by(Tag.name).all()


def create_tag(db: Session, name: str, color: str, user: User) -> Tag:
    existing = db.query(Tag).filter(Tag.name == name, Tag.user_id == user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag with this name already exists")
    tag = Tag(name=name, color=color, user_id=user.id)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def delete_tag(db: Session, tag_id: uuid.UUID, user: User) -> None:
    tag = db.query(Tag).filter(Tag.id == tag_id, Tag.user_id == user.id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    db.delete(tag)
    db.commit()
