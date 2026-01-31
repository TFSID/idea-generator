FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better cache usage
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
# We copy to a 'backend' directory because the application expects 'backend' package structure
# (e.g. "from backend.models import ...")
COPY . backend/

# Set Python path to include /app so 'backend' package is found
ENV PYTHONPATH=/app

# Expose the application port
EXPOSE 8000

# Run the application
# We use the module syntax to run the app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
