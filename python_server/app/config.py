# File: python_server/app/config.py

from pydantic_settings import BaseSettings
# from pydantic import BaseSettings

import logging

# Initialize logger for config
logger = logging.getLogger("app.config")

class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_NAME: str
    JWT_SECRET: str
    DEBUG_MODE: bool = False
    AUTH_ENABLED: bool = False
    LOG_LEVEL: str = "INFO"  # Options: DEBUG, INFO, WARNING, ERROR, CRITICAL

    class Config:
        env_file = ".env"

settings = Settings()

# Access settings as needed
DATABASE_URL = settings.DATABASE_URL
DATABASE_NAME = settings.DATABASE_NAME
JWT_SECRET = settings.JWT_SECRET
DEBUG_MODE = settings.DEBUG_MODE
AUTH_ENABLED = settings.AUTH_ENABLED
LOG_LEVEL = settings.LOG_LEVEL

# Log the current settings for debugging (ensure LOG_LEVEL includes INFO)
logger.info(f"DEBUG_MODE: {DEBUG_MODE}")
logger.info(f"AUTH_ENABLED: {AUTH_ENABLED}")
logger.info(f"LOG_LEVEL: {LOG_LEVEL}")
