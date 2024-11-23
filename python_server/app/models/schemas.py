# File: app/models/schemas.py

from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime
import re

# Timing model
class Timing(BaseModel):
    days: Optional[str] = Field(None, example="MW")
    start_time: Optional[str] = Field(None, example="08:00 AM")
    end_time: Optional[str] = Field(None, example="09:15 AM")

    @validator('days')
    def validate_days(cls, v):
        if v and not re.match(r'^[SMTWRFA]{1,2}$', v):
            raise ValueError("Days must be uppercase letters representing weekdays (e.g., 'MW').")
        return v

# Course model
class Course(BaseModel):
    course_code: str = Field(..., example="CSE101")
    section: Optional[int] = Field(None, example=1)
    faculty: Optional[str] = Field(None, example="AASR")
    email: Optional[EmailStr] = None
    timing: Optional[Timing] = None
    room_no: Optional[str] = None
    capacity: Optional[int] = Field(None, example=30)
    seat_taken: Optional[int] = Field(None, example=25)

    @validator('course_code')
    def validate_course_code(cls, v):
        if not v:
            raise ValueError("course_code is required.")
        return v

# OfferedCourses model
class OfferedCourses(BaseModel):
    department: str = Field(..., example="CSE")
    semester: int = Field(..., ge=1, le=3, example=3)
    year: int = Field(..., example=2024)  # Added 'year' field
    courses: List[Course]
    uploaded_by: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Faculty model
class Faculty(BaseModel):
    short_name: str = Field(..., example="AASR")
    email: EmailStr
    name: str
    designation: str = Field(..., example="Lecturer")

# FacultyInformation model
class FacultyInformation(BaseModel):
    department: str = Field(..., example="CSE")
    faculty_list: List[Faculty]
    uploaded_by: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Response Models for GET Endpoints

class CourseResponse(BaseModel):
    department: str = Field(..., example="CSE")
    semester: int = Field(..., ge=1, le=3, example=3)
    year: int = Field(..., example=2024)
    courses: List[Course]
    totalCourses: int = Field(..., example=10)
    uploaded_by: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class FacultyResponse(BaseModel):
    department: str = Field(..., example="CSE")
    faculty_list: List[Faculty]
