# File: app/models/database.py

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
from app.config import DATABASE_URL, DATABASE_NAME
import logging

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        client = AsyncIOMotorClient(DATABASE_URL)
        db = client[DATABASE_NAME]
        # Create indexes
        await db["faculty_information"].create_index(
            [("department", ASCENDING)], unique=True
        )
        await db["offered_courses"].create_index(
            [("department", ASCENDING), ("semester", ASCENDING), ("year", ASCENDING)],
            unique=True
        )
        logger.info("✅ Connected to MongoDB")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    global client
    if client:
        client.close()
        logger.info("✅ MongoDB connection closed")

def get_database():
    if db is None:
        raise Exception("Database not connected. Please check your MongoDB connection.")
    return db
