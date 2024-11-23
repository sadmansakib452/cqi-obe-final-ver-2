# File: app/routes/course_routes.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query, Form
from app.services.course_service import process_offered_courses, get_offered_courses
from app.models.schemas import CourseResponse
from app.models.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.exceptions.custom_exceptions import FileProcessingError
import logging
from app.config import DEBUG_MODE
from typing import Optional

router = APIRouter(tags=["Offered Courses"])
logger = logging.getLogger(__name__)

@router.post("/upload/offeredCourses")
async def upload_offered_courses(
    file: UploadFile = File(...),
    year: int = Form(..., description="Year of the courses, e.g., 2024"),
    semester_no: int = Form(..., ge=1, le=3, description="Semester number (1: Spring, 2: Summer, 3: Fall)"),
    department: str = Form(..., description="Department short name, e.g., CSE"),
    # Temporarily mocking current_user since authentication is not implemented
    current_user: dict = Depends(lambda: {"username": "test_user"})
):
    """
    Endpoint to upload offered courses file with required metadata.

    **Form Fields:**
    - `file`: The Excel file containing offered courses.
    - `year`: Year of the courses, e.g., 2024.
    - `semester_no`: Semester number (1: Spring, 2: Summer, 3: Fall).
    - `department`: Department short name, e.g., CSE.
    """
    try:
        logger.info(f"📥 User '{current_user['username']}' uploading offered courses file: {file.filename}")

        # Read file content
        file_content = await file.read()

        if DEBUG_MODE:
            logger.debug(f"📄 File content size: {len(file_content)} bytes")

        # Process the file, passing the metadata
        result = await process_offered_courses(
            file_content,
            user=current_user,
            year=year,
            semester_no=semester_no,
            department=department
        )

        return {
            "message": result["message"],
            "department": result["department"],
            "semester": result["semester"],
            "year": result["year"],
            "total_courses": result["total_courses"],
            "uploaded_by": result["uploaded_by"],
            "warnings": result.get("warnings", [])
        }

    except FileProcessingError as e:
        logger.error(f"❌ File processing error: {e.detail}")
        raise HTTPException(status_code=400, detail=e.detail)
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="❌ Internal server error.")

@router.get(
    "/offeredCourses",
    response_model=CourseResponse,
    summary="Retrieve Offered Courses",
    tags=["Offered Courses"]
)
async def fetch_offered_courses(
    department: str = Query(..., description="Department code (e.g., CSE)"),
    semester: int = Query(..., ge=1, le=3, description="Semester number (1: Spring, 2: Summer, 3: Fall)"),
    year: int = Query(..., description="Academic year (e.g., 2024)"),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Fetches offered courses based on department, semester, and year.
    """
    offered_courses = await get_offered_courses(db, department, semester, year)
    if not offered_courses:
        raise HTTPException(status_code=404, detail="No courses found for the given parameters.")
    return offered_courses
