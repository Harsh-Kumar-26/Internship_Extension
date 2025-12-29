from pydantic import BaseModel
from typing import List

class User(BaseModel):
    user_id: int
    skills: str
    location: str
    rural: int
    tribal: int

class Internship(BaseModel):
    internship_id: int
    title: str
    description: str
    location: str
    capacity: int

class Inputtomodel(BaseModel):
    users: List[User]
    internships: List[Internship]

class Outputfrommodel(BaseModel):
    user_id: int
    assigned_internship: str
    final_score: float
