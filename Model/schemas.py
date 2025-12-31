from pydantic import BaseModel
from typing import List


class User(BaseModel):
    user_id: str
    skills: str
    location: str
    rural: int
    tribal: int
    applied_internships: List[str]


class Internship(BaseModel):
    internship_id: str
    title: str
    description: str
    location: str
    capacity: int


class Inputtomodel(BaseModel):
    users: List[User]
    internships: List[Internship]


class Outputfrommodel(BaseModel):
    user_id: str
    assigned_internship: str
    score: float
