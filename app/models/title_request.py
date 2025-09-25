from pydantic import BaseModel
from enum import Enum
from typing import Optional

class RequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    IN_PUBLICATION = "in_publication"

class Request(BaseModel):
    request_id: str
    user_id: str
    request_type: str
    status: RequestStatus
    submitted_at: str
    updated_at: Optional[str]
    processed_by: Optional[str]
