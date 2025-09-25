from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    user_id: str
    npi: str
    first_name: str
    last_name: str
    sex: str
    date_of_birth: str
    email: Optional[str]
    phone_number: Optional[str]
    address: str
    profession: Optional[str]
    #role: Optional[str] = "user"
    #password: Optional[str] 
    created_at: str
