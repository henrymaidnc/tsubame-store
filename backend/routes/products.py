from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db
from models.schemas import ProductBase, ProductCreate, ProductUpdate
from services.crud import get_products, get_product_by_id, create_product, update_product, delete_product

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductBase])
async def get_all_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.get("/{product_id}", response_model=ProductBase)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if product is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductBase)
async def create_new_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product)

@router.put("/{product_id}", response_model=ProductBase)
async def update_existing_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    return update_product(db, product_id, product)

@router.delete("/{product_id}")
async def delete_existing_product(product_id: int, db: Session = Depends(get_db)):
    delete_product(db, product_id)
    return {"message": "Product deleted successfully"}
