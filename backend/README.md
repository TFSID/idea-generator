# GenScript Backend

FastAPI backend for GenScript, providing AI-powered idea generation and MongoDB persistence.

## Prerequisites

- Python 3.10+
- MongoDB instance running (default: `mongodb://localhost:27017`)
- Gemini API Key

## Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=genscript
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Running the Server

Start the FastAPI server using Uvicorn:

```bash
python main.py
```

The API will be available at `http://localhost:8000`.
You can access the interactive API documentation at `http://localhost:8000/docs`.
