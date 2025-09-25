from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Image(BaseModel):
    id: str
    filename: str
    upload_date: datetime
    user_id: str
    processed: bool = False
    processing_results: Optional[dict] = None
    file_path: str
    original_pdf: Optional[str] = None