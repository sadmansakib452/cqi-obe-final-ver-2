# File: python_server/app/services/faculty_service.py

import pandas as pd
from io import BytesIO
from app.models.schemas import FacultyInformation, Faculty
from app.models.database import get_database
from app.exceptions.custom_exceptions import FileProcessingError
import logging
import re

logger = logging.getLogger(__name__)

def camel_to_snake(name: str) -> str:
    """
    Converts CamelCase or camelCase strings to snake_case.
    
    :param name: The string to convert.
    :return: The converted snake_case string.
    """
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    snake_case = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
    return snake_case

async def process_faculty_info(file_content: bytes, uploaded_by: str) -> dict:
    """
    Processes the uploaded faculty information file and saves it to the database.
    
    :param file_content: Content of the uploaded file.
    :param uploaded_by: The ID of the user uploading the data.
    :return: Summary of the processing result.
    """
    try:
        # Convert bytes to a BytesIO object
        excel_file = BytesIO(file_content)
        # Read the uploaded Excel file using openpyxl engine
        df = pd.read_excel(excel_file, engine='openpyxl')
        logger.info("✅ Excel file read into DataFrame successfully.")
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        raise FileProcessingError(detail="❌ Missing required dependencies for Excel processing.")
    except Exception as e:
        logger.error(f"❌ Failed to read Excel file: {e}")
        raise FileProcessingError(detail="❌ Invalid Excel file format.")

    # Normalize column names to snake_case
    df.columns = [camel_to_snake(col) for col in df.columns]

    # Validate required columns
    required_columns = ["short_name", "email", "name", "designation_name", "academic_department_short_name"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        logger.error(f"❌ Uploaded file is missing required columns: {missing_columns}")
        raise FileProcessingError(detail=f"❌ Missing columns: {', '.join(missing_columns)}")

    # Convert DataFrame to list of Faculty objects
    faculty_list = []
    for _, row in df.iterrows():
        try:
            faculty = Faculty(
                short_name=row["short_name"],
                email=row["email"],
                name=row["name"],
                designation=row["designation_name"]
            )
            faculty_list.append(faculty)
        except Exception as e:
            logger.warning(f"⚠️ Skipping invalid faculty record: {row.to_dict()} | Error: {e}")

    if not faculty_list:
        logger.error("❌ No valid faculty records found.")
        raise FileProcessingError(detail="❌ No valid faculty records found.")

    faculty_info = FacultyInformation(
        department=df["academic_department_short_name"].iloc[0],
        faculty_list=faculty_list,
        uploaded_by=uploaded_by
    )

    # Save to database
    db = get_database()
    try:
        result = await db["faculty_information"].replace_one(
            {"department": faculty_info.department},
            faculty_info.dict(by_alias=True),
            upsert=True
        )
        if result.upserted_id:
            logger.info(f"✅ Inserted new faculty information for department: {faculty_info.department}")
            message = "✅ Inserted new faculty information."
        else:
            logger.info(f"✅ Updated faculty information for department: {faculty_info.department}")
            message = "✅ Updated existing faculty information."
    except Exception as e:
        logger.error(f"❌ Failed to save faculty information: {e}")
        raise FileProcessingError(detail="❌ Failed to save faculty information.")

    return {
        "message": message,
        "department": faculty_info.department,
        "total_records": len(faculty_list)
    }
