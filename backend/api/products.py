"""Products API router — uses BaseCRUD pattern."""
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.deps import get_db
from crud.product import product_crud
from models.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductWithInventory,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[ProductWithInventory])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List products with pagination. Testable in Swagger."""
    return product_crud.get_multi(db, skip=skip, limit=limit)


@router.get("/{product_id}", response_model=ProductWithInventory)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    """Get a single product by ID."""
    return product_crud.get_or_404(db, product_id, detail="Product not found")


@router.post("/", response_model=ProductWithInventory)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):
    """Create a new product."""
    return product_crud.create(db, schema=product)


@router.put("/{product_id}", response_model=ProductWithInventory)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):
    """Update a product by ID."""
    return product_crud.update(
        db, product_id, schema=product, detail="Product not found"
    )


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    """Delete a product by ID."""
    product_crud.delete(db, product_id, detail="Product not found")
    return {"message": "Product deleted successfully"}
