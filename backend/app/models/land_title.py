from pydantic import BaseModel
from enum import Enum
from typing import Optional

class TitleStatus(str, Enum):
    IN_PUBLICATION = "in_publication"
    VALID = "valid"
    ARCHIVED = "archived"
    DISPUTE = "dispute"

class Title(BaseModel):
    title_id: str
    owner_id: str
    land_location: str
    surface_area: float
    registration_number: str
    status: TitleStatus
    created_at: str
