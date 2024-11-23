# File: python_server/app/middleware/logging_middleware.py

import logging
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response: Response = await call_next(request)
            process_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            logger.info(
                f"✅ {request.method} {request.url.path} completed_in={process_time:.2f}ms status_code={response.status_code}"
            )
            return response
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"❌ {request.method} {request.url.path} failed_in={process_time:.2f}ms error={str(e)}"
            )
            raise e
