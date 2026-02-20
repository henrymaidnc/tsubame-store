from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db
from models.schemas import RevenueBase, RevenueCreate, RevenueUpdate, RevenueSummary
from services.crud import get_revenue_data, get_revenue_by_id, create_revenue, update_revenue, delete_revenue, get_revenue_summary

router = APIRouter(prefix="/revenue", tags=["revenue"])

@router.get("/", response_model=List[RevenueBase])
async def get_all_revenue(db: Session = Depends(get_db)):
    return get_revenue_data(db)

@router.post("/", response_model=RevenueBase)
async def create_new_revenue(revenue: RevenueCreate, db: Session = Depends(get_db)):
    return create_revenue(db, revenue)

@router.put("/{revenue_id}", response_model=RevenueBase)
async def update_existing_revenue(revenue_id: int, revenue: RevenueUpdate, db: Session = Depends(get_db)):
    return update_revenue(db, revenue_id, revenue)

@router.delete("/{revenue_id}")
async def delete_existing_revenue(revenue_id: int, db: Session = Depends(get_db)):
    delete_revenue(db, revenue_id)
    return {"message": "Revenue data deleted successfully"}

@router.get("/summary", response_model=RevenueSummary)
async def get_summary(db: Session = Depends(get_db)):
    return get_revenue_summary(db)
