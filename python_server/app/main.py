# File: python_server/app/main.py

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import faculty_routes, course_routes
from app.models.database import connect_to_mongo, close_mongo_connection
from app.middleware.logging_middleware import LoggingMiddleware
from app.config import DEBUG_MODE, AUTH_ENABLED, LOG_LEVEL

# Initialize FastAPI app
app = FastAPI(title="📚 Course Management Backend")

# Define allowed origins
origins = [
    "http://localhost",
    "http://localhost:3000",
    # Add more origins if necessary
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from the specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Configure global logging
def configure_logging():
    # Set the global log level based on the LOG_LEVEL environment variable
    numeric_level = getattr(logging, LOG_LEVEL.upper(), logging.INFO)

    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Suppress verbose logs from third-party libraries unless DEBUG_MODE is True
    if not DEBUG_MODE:
        logging.getLogger("pymongo").setLevel(logging.WARNING)
        logging.getLogger("uvicorn.access").setLevel(logging.INFO)
        logging.getLogger("uvicorn.error").setLevel(logging.ERROR)
    else:
        # If DEBUG_MODE is True, set pymongo to DEBUG
        logging.getLogger("pymongo").setLevel(logging.DEBUG)
        logging.getLogger("uvicorn.access").setLevel(logging.DEBUG)
        logging.getLogger("uvicorn.error").setLevel(logging.DEBUG)

    # Optionally, adjust other third-party loggers here
    # Example:
    # logging.getLogger("some_other_library").setLevel(logging.WARNING)

# Call the logging configuration function
configure_logging()

logger = logging.getLogger(__name__)

# Add middleware
app.add_middleware(LoggingMiddleware)

# Include routers
app.include_router(faculty_routes.router)
app.include_router(course_routes.router)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting up the application...")
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🔄 Shutting down the application...")
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "📡 Python backend for course management is running."}
