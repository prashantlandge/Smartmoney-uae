"""Embeddings API — semantic search and collaborative filtering."""

from fastapi import APIRouter
from pydantic import BaseModel
from app.features.embeddings.search import semantic_search
from app.features.embeddings.collaborative import get_collaborative_recommendations

router = APIRouter()


class SearchResult(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    category: str
    description: str
    similarity: float


class SemanticSearchResponse(BaseModel):
    query: str
    results: list[SearchResult]


class CollaborativeItem(BaseModel):
    product_id: str
    product_name: str
    provider_name: str
    category: str
    chooser_count: int
    reason: str


class CollaborativeResponse(BaseModel):
    session_id: str
    items: list[CollaborativeItem]


@router.get("/semantic", response_model=SemanticSearchResponse)
async def search(q: str, limit: int = 10):
    """Semantic product search using natural language."""
    results = await semantic_search(q, limit=limit)
    return SemanticSearchResponse(
        query=q,
        results=[SearchResult(**r) for r in results],
    )


@router.get("/collaborative/{session_id}", response_model=CollaborativeResponse)
async def collaborative(session_id: str, limit: int = 5):
    """Collaborative filtering — products chosen by similar users."""
    items = await get_collaborative_recommendations(session_id, limit=limit)
    return CollaborativeResponse(
        session_id=session_id,
        items=[CollaborativeItem(**item) for item in items],
    )
