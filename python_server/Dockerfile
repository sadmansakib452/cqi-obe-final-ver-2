# File: python_server/Dockerfile

# Use the official Python 3.11 slim image as the base
FROM python:3.11-slim

# Set environment variables to prevent Python from writing pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Remove build dependencies to keep the image slim (optional but recommended)
RUN apt-get purge -y --auto-remove build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy the rest of the project files
COPY . .

# Expose the port the app runs on
EXPOSE 3005

# Command to run the application using Python's module execution
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3005"]
