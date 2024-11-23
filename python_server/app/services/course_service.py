# File: app/services/course_service.py

import pandas as pd
from io import BytesIO
from typing import Dict, List, Optional  # Step 1: Import Optional
from app.models.schemas import OfferedCourses, Course, Timing
from app.models.database import get_database
from app.utils.validators import parse_timing
from app.exceptions.custom_exceptions import FileProcessingError
import logging
import numpy as np

from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.schemas import CourseResponse

logger = logging.getLogger(__name__)

# Define a mapping from Excel columns to backend-expected columns
COLUMN_MAPPING = {
    'course': 'course_code',
    'room_no': 'room_no',
    # Add more mappings if necessary
}

# Define columns to drop
COLUMNS_TO_DROP = ['dedicated_department', 'action']

def sanitize_field(x, field_type: str) -> Optional:
    """
    Sanitize fields by setting them to None if missing or invalid.
    For 'room_no', convert to string.
    For other fields, retain their value or set to None if NaN.
    """
    if pd.isna(x):
        return None
    if field_type == 'room_no':
        return str(x)
    return x

async def process_offered_courses(file_content: bytes, user: dict, year: int, semester_no: int, department: str) -> dict:
    """
    Processes the offered courses file and saves it to the database.

    :param file_content: Content of the uploaded file.
    :param user: Dictionary containing user information.
    :param year: Year of the offered courses.
    :param semester_no: Semester number (1: Spring, 2: Summer, 3: Fall).
    :param department: Department short name, e.g., CSE.
    :return: Summary of the processing result.
    """
    try:
        logger.info(f"✅ Received metadata: Year={year}, SemesterNo={semester_no}, Department={department}")
    except Exception as e:
        logger.error(f"❌ Metadata extraction error: {e}")
        raise FileProcessingError(detail="❌ Failed to process metadata.")

    try:
        # Read the uploaded Excel file using openpyxl engine
        df = pd.read_excel(BytesIO(file_content), engine='openpyxl')
        logger.info("✅ Excel file read into DataFrame successfully.")
    except Exception as e:
        logger.error(f"❌ Failed to read Excel file: {e}")
        raise FileProcessingError(detail="❌ Invalid Excel file format.")

    # Normalize column names to lowercase with underscores
    df.columns = [col.lower().replace(' ', '_') for col in df.columns]

    # Rename columns based on COLUMN_MAPPING
    df.rename(columns=COLUMN_MAPPING, inplace=True)

    # Drop unnecessary columns
    df.drop(columns=[col for col in COLUMNS_TO_DROP if col in df.columns], inplace=True)

    # Validate required columns
    required_columns = ["course_code", "section", "faculty", "capacity", "seat_taken"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        logger.error(f"❌ Uploaded file is missing required columns: {missing_columns}")
        raise FileProcessingError(detail=f"❌ Missing columns: {', '.join(missing_columns)}")

    # Handle 'timing' as optional
    if 'timing' not in df.columns:
        logger.warning("⚠️ 'timing' column is missing. Setting timing to None for all records.")
        df['timing'] = None
    else:
        # Replace NaN with None
        df['timing'] = df['timing'].where(pd.notnull(df['timing']), None)

    # Handle 'room_no' conversion to string without validation
    if 'room_no' in df.columns:
        df['room_no'] = df['room_no'].apply(lambda x: sanitize_field(x, 'room_no'))

    # Sanitize other fields
    for field in ['capacity', 'seat_taken', 'section', 'faculty', 'course_code']:
        df[field] = df[field].apply(lambda x: sanitize_field(x, field))

    # Fetch faculty information for mapping
    db = get_database()
    faculty_info = await db["faculty_information"].find_one({"department": department})
    if not faculty_info:
        logger.error(f"❌ No faculty information found for department: {department}")
        raise FileProcessingError(detail=f"❌ No faculty information found for department: {department}")

    faculty_email_map = {faculty["short_name"]: faculty["email"] for faculty in faculty_info.get("faculty_list", [])}

    # Convert to list of Course objects with email mapping
    course_list = []
    warnings_list = []

    courses = df.to_dict(orient="records")
    for index, course_data in enumerate(courses, start=1):
        errors = []
        try:
            course_code = course_data.get("course_code")
            section = course_data.get("section")
            faculty_short_name = course_data.get("faculty")
            email = faculty_email_map.get(faculty_short_name, None)
            timing_parsed = parse_timing(course_data.get("timing"))
            room_no = course_data.get("room_no")
            capacity = course_data.get("capacity")
            seat_taken = course_data.get("seat_taken")

            # Check mandatory fields
            if not course_code:
                errors.append("Missing course_code.")
            if not faculty_short_name:
                errors.append("Missing faculty.")

            if email is None and faculty_short_name:
                errors.append(f"Email mapping not found for faculty '{faculty_short_name}'.")

            if errors:
                logger.warning(f"⚠️ Record #{index} has errors: {', '.join(errors)}")
                warnings_list.append({"record": index, "course_code": course_code, "errors": errors})
                # Create the course with possible None values
                course = Course(
                    course_code=course_code,
                    section=section,
                    faculty=faculty_short_name,
                    email=email,
                    timing=timing_parsed,
                    room_no=room_no,
                    capacity=capacity,
                    seat_taken=seat_taken
                )
                course_list.append(course)
                continue

            # Create Course instance
            course = Course(
                course_code=course_code,
                section=section,
                faculty=faculty_short_name,
                email=email,
                timing=timing_parsed,
                room_no=room_no,
                capacity=capacity,
                seat_taken=seat_taken
            )
            course_list.append(course)
        except Exception as e:
            error_message = f"Unexpected error: {e}"
            logger.warning(f"⚠️ Skipping invalid course record #{index}: {course_data} | Error: {error_message}")
            warnings_list.append({"record": index, "course_code": course_data.get("course_code"), "errors": [error_message]})
            continue

    # No courses to save
    if not course_list:
        logger.error("❌ No valid course records found.")
        raise FileProcessingError(detail="❌ No valid course records found.")

    # Create OfferedCourses instance
    offered_courses = OfferedCourses(
        department=department,
        semester=semester_no,
        year=year,  # Include 'year' here
        courses=course_list,
        uploaded_by=user.get("username")
    )

    # Save to database
    try:
        result = await db["offered_courses"].replace_one(
            {"department": offered_courses.department, "semester": offered_courses.semester, "year": offered_courses.year},
            offered_courses.dict(by_alias=True),
            upsert=True
        )
        if result.upserted_id:
            logger.info(f"✅ Inserted new offered courses for department: {offered_courses.department}, semester: {offered_courses.semester}, year: {offered_courses.year}")
            message = "✅ Inserted new offered courses."
        else:
            logger.info(f"✅ Updated offered courses for department: {offered_courses.department}, semester: {offered_courses.semester}, year: {offered_courses.year}")
            message = "✅ Updated existing offered courses."
    except Exception as e:
        logger.error(f"❌ Failed to save offered courses: {e}")
        raise FileProcessingError(detail="❌ Failed to save offered courses.")

    # Prepare response
    response = {
        "message": message,
        "department": offered_courses.department,
        "semester": offered_courses.semester,
        "year": offered_courses.year,
        "total_courses": len(course_list),
        "uploaded_by": offered_courses.uploaded_by,
        "warnings": warnings_list
    }

    return response

async def get_offered_courses(
    db: AsyncIOMotorDatabase,
    department: str,
    semester: int,
    year: int
) -> Optional[CourseResponse]:
    """
    Retrieves offered courses based on department, semester, and year.
    """
    query = {
        "department": department,
        "semester": semester,
        "year": year
    }
    document = await db["offered_courses"].find_one(query)
    if not document:
        logger.info(f"No courses found for department={department}, semester={semester}, year={year}")
        return None
    # Calculate totalCourses
    total_courses = len(document["courses"]) if "courses" in document else 0

    # Add totalCourses to the document before returning
    document["totalCourses"] = total_courses
    
    return CourseResponse(**document)