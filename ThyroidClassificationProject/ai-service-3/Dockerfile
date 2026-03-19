FROM python:3.10-slim

WORKDIR /app

# Install dependencies separately to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port
EXPOSE 8002

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
