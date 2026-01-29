from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone

class IdeaBase(BaseModel):
    category: str
    title: str
    description: str
    refinedPrompt: Optional[str] = None
    moneyValue: Optional[str] = None
    effortValue: Optional[str] = None
    monetizationStrategies: Optional[str] = None

class IdeaCreate(IdeaBase):
    pass

class Idea(IdeaBase):
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "category": "Python Scripts",
                "title": "Automated Web Scraper",
                "description": "A scraper for market trends.",
                "refinedPrompt": "...",
                "created_at": "2023-10-27T12:00:00"
            }
        }
    )

    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
