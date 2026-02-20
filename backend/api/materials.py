"""Materials API router — uses BaseCRUD pattern (scalable retail module)."""
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.deps import get_db
from crud.material import material_crud
from models.schemas import MaterialBase, MaterialCreate, MaterialUpdate

router = APIRouter(prefix="/materials", tags=["materials"])


@router.get("/", response_model=List[MaterialBase])
async def list_materials(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List materials with pagination."""
    return material_crud.get_multi(db, skip=skip, limit=limit)


@router.get("/{material_id}", response_model=MaterialBase)
async def get_material(
    material_id: int,
    db: Session = Depends(get_db),
):
    """Get a single material by ID."""
    return material_crud.get_or_404(
        db, material_id, detail="Material not found"
    )


@router.post("/", response_model=MaterialBase)
async def create_material(
    material: MaterialCreate,
    db: Session = Depends(get_db),
):
    """Create a new material."""
    return material_crud.create(db, schema=material)


@router.put("/{material_id}", response_model=MaterialBase)
async def update_material(
    material_id: int,
    material: MaterialUpdate,
    db: Session = Depends(get_db),
):
    """Update a material by ID."""
    return material_crud.update(
        db, material_id, schema=material, detail="Material not found"
    )


@router.delete("/{material_id}")
async def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
):
    """Delete a material by ID."""
    material_crud.delete(db, material_id, detail="Material not found")
    return {"message": "Material deleted successfully"}
