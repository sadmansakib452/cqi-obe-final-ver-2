# File: python_server/app/routes/faculty_routes.py

from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.faculty_service import process_faculty_info
from app.models.authentication import get_authenticated_user
from app.exceptions.custom_exceptions import FileProcessingError
import logging
from app.config import DEBUG_MODE

router = APIRouter(tags=["Faculty Information"])
logger = logging.getLogger(__name__)


@router.post("/upload/facultyInformation")
async def upload_faculty_information(
    file: UploadFile = File(...), 
    current_user: Optional[dict] = Depends(get_authenticated_user)
):
    """
    Endpoint to upload and process faculty information.
    """
    try:
        logger.debug(f"Received upload request from user: {current_user}")
        if current_user and current_user.get("username") != "anonymous":
            uploader = current_user.get("username", "anonymous")
            logger.info(f"📥 User '{uploader}' uploading faculty information file: {file.filename}")
        else:
            uploader = "anonymous"
            logger.info(f"📥 Anonymous user uploading faculty information file: {file.filename}")
        
        # Read file content
        file_content = await file.read()

        if DEBUG_MODE:
            logger.debug(f"📄 File content size: {len(file_content)} bytes")

        # Process the file
        result = await process_faculty_info(file_content, uploaded_by=uploader)

        return {
            "message": result["message"],
            "department": result["department"],
            "total_records": result["total_records"],
            "uploaded_by": uploader
        }

    except FileProcessingError as e:
        logger.error(f"❌ File processing error: {e.detail}")
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="❌ Internal server error.")
