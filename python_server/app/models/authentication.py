# File: python_server/app/models/authentication.py

from typing import Optional, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from app.config import JWT_SECRET, AUTH_ENABLED
from app.exceptions.custom_exceptions import AuthenticationError
import logging

logger = logging.getLogger(__name__)

# Set auto_error to False to make token optional
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


def decode_jwt(token: str) -> Dict:
    """
    Decodes the JWT token using the provided JWT_SECRET.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        logger.debug(f"Decoded JWT payload: {payload}")
        return payload
    except jwt.ExpiredSignatureError:
        logger.error("❌ Token has expired.")
        raise AuthenticationError(detail="❌ Token has expired.")
    except jwt.InvalidTokenError:
        logger.error("❌ Invalid token.")
        raise AuthenticationError(detail="❌ Invalid token.")


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict]:
    """
    Retrieves the current user based on JWT token.
    Returns None if token is not provided or invalid.
    """
    if not token:
        logger.debug("No token provided.")
        return None
    try:
        payload = decode_jwt(token)
    except AuthenticationError as e:
        logger.error(f"Authentication error: {e.detail}")
        return None  # Let 'get_authenticated_user' handle the response

    user = {
        "username": payload.get("username"),
        "role": payload.get("role"),
        "department": payload.get("department")
    }
    if not user["username"]:
        logger.error("❌ User information missing in token.")
        raise AuthenticationError(detail="❌ User information is incomplete.")
    logger.debug(f"Authenticated user: {user}")
    return user


# Mock Authentication Dependency for Testing
async def get_mock_user() -> Dict:
    logger.debug("Returning mock user.")
    return {
        "username": "anonymous",
        "role": "guest",
        "department": "N/A"
    }


# Corrected Dependency that toggles between real and mock authentication
async def get_authenticated_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict:
    """
    Conditionally returns the authenticated user or a mock user based on AUTH_ENABLED.
    """
    logger.debug(f"AUTH_ENABLED: {AUTH_ENABLED}")
    if AUTH_ENABLED:
        logger.debug("AUTH_ENABLED is True, enforcing authentication.")
        if not token:
            logger.warning("❌ No token provided, but AUTH_ENABLED=True.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="❌ Not authenticated.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await get_current_user(token)
        if user is None:
            logger.warning("❌ Invalid token provided.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="❌ Not authenticated.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logger.debug(f"Authenticated user: {user}")
        return user
    else:
        logger.debug("AUTH_ENABLED is False, returning mock user.")
        mock_user = await get_mock_user()
        logger.debug(f"Mock user returned: {mock_user}")
        return mock_user
