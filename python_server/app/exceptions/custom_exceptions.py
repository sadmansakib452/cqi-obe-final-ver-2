# app/exceptions/custom_exceptions.py
from fastapi import HTTPException

class DatabaseConnectionError(HTTPException):
    def __init__(self, detail: str = "Database connection failed."):
        super().__init__(status_code=500, detail=detail)

class FileProcessingError(HTTPException):
    def __init__(self, detail: str = "Error processing the uploaded file."):
        super().__init__(status_code=400, detail=detail)

class ValidationError(HTTPException):
    def __init__(self, detail: str = "Validation error occurred."):
        super().__init__(status_code=422, detail=detail)

class AuthenticationError(HTTPException):
    def __init__(self, detail: str = "Authentication failed."):
        super().__init__(status_code=401, detail=detail)
