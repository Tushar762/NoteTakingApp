import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# --- Tag Schemas ---

class TagCreate(BaseModel):
    name: str
    color: str = "#6c63ff"


class TagOut(BaseModel):
    id: uuid.UUID
    name: str
    color: str

    model_config = {"from_attributes": True}


# --- Note Schemas ---

class NoteCreate(BaseModel):
    title: str = "Untitled"
    content: Optional[str] = ""
    color: str = "#1e1e2e"
    tag_ids: List[uuid.UUID] = []


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    color: Optional[str] = None
    tag_ids: Optional[List[uuid.UUID]] = None


class NoteOut(BaseModel):
    id: uuid.UUID
    title: str
    content: Optional[str]
    color: str
    is_pinned: bool
    is_archived: bool
    tags: List[TagOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
