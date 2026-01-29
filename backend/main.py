import uuid
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from backend.models import Idea, IdeaCreate
from backend.database import ideas_collection
from backend.services.gemini import generate_ideas_ai
from datetime import datetime, timezone

app = FastAPI(title="GenScript API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to GenScript API"}

@app.post("/api/generate", response_model=List[Idea])
async def generate_ideas(
    input_text: str = Body(..., embed=True),
    mode: str = Body(..., embed=True)
):
    try:
        raw_ideas = await generate_ideas_ai(input_text, mode)

        ideas_to_save = []
        for ri in raw_ideas:
            idea_id = str(uuid.uuid4())
            idea_data = {
                "_id": idea_id,
                "category": ri.get("category"),
                "title": ri.get("title"),
                "description": ri.get("description"),
                "refinedPrompt": ri.get("refinedPrompt"),
                "moneyValue": ri.get("moneyValue"),
                "effortValue": ri.get("effortValue"),
                "monetizationStrategies": ri.get("monetizationStrategies"),
                "created_at": datetime.now(timezone.utc)
            }
            ideas_to_save.append(idea_data)

        if ideas_to_save:
            await ideas_collection.insert_many(ideas_to_save)

        return ideas_to_save
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ideas", response_model=List[Idea])
async def get_ideas():
    ideas = await ideas_collection.find().to_list(1000)
    return ideas

@app.get("/api/ideas/{idea_id}", response_model=Idea)
async def get_idea(idea_id: str):
    idea = await ideas_collection.find_one({"_id": idea_id})
    if idea:
        return idea
    raise HTTPException(status_code=404, detail="Idea not found")

@app.delete("/api/ideas/{idea_id}")
async def delete_idea(idea_id: str):
    delete_result = await ideas_collection.delete_one({"_id": idea_id})
    if delete_result.deleted_count == 1:
        return {"message": "Idea deleted successfully"}
    raise HTTPException(status_code=404, detail="Idea not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
