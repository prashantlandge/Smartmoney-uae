from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class ProductResponse(BaseModel):
    id: str
    provider_name: str
    provider_logo: str
    product_name: str
    product_type: str
    description: str
    features: dict
    affiliate_link: str
    is_islamic: bool
    is_active: bool


class ProductListRequest(BaseModel):
    category: str
    sort_by: str = "provider_name"
    limit: int = 20
