# app/utils/file_handler.py
import aiofiles
import os
import logging
from app.config import DEBUG_MODE

logger = logging.getLogger(__name__)

TEMP_DIR = "temp_uploads"

async def save_temp_file(file_content: bytes, filename: str) -> str:
    os.makedirs(TEMP_DIR, exist_ok=True)
    temp_file_path = os.path.join(TEMP_DIR, filename)
    try:
        async with aiofiles.open(temp_file_path, 'wb') as temp_file:
            await temp_file.write(file_content)
        if DEBUG_MODE:
            logger.info(f"📂 File temporarily saved at: {temp_file_path}")
        return temp_file_path
    except Exception as e:
        logger.error(f"❌ Failed to save temporary file: {e}")
        raise

async def delete_temp_file(file_path: str):
    try:
        os.remove(file_path)
        if DEBUG_MODE:
            logger.info(f"🗑️ Temporary file deleted: {file_path}")
    except Exception as e:
        logger.warning(f"⚠️ Failed to delete temporary file {file_path}: {e}")
