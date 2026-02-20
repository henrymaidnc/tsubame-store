"""
BaseCRUD: generic CRUD mixin for scaling retail modules.

Usage:
    class ProductCRUD(BaseCRUD[Product, ProductCreate, ProductUpdate]):
        __model__ = Product
    product_crud = ProductCRUD()
"""
from typing import Any, Generic, List, Optional, Type, TypeVar

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Model = SQLAlchemy model, CreateSchema = Pydantic create, UpdateSchema = Pydantic update
ModelT = TypeVar("ModelT")
CreateSchemaT = TypeVar("CreateSchemaT", bound=BaseModel)
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=BaseModel)


class BaseCRUD(Generic[ModelT, CreateSchemaT, UpdateSchemaT]):
    """Generic CRUD operations for any SQLAlchemy model with Pydantic schemas."""

    __model__: Type[ModelT]

    def _serialize(self, schema: BaseModel, *, exclude_unset: bool = True) -> dict[str, Any]:
        """Convert Pydantic schema to dict (v1 .dict() or v2 .model_dump())."""
        if hasattr(schema, "model_dump"):
            return schema.model_dump(exclude_unset=exclude_unset)
        return schema.dict(exclude_unset=exclude_unset)

    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        **filters: Any,
    ) -> List[ModelT]:
        """List records with optional pagination and filters."""
        q = db.query(self.__model__)
        for key, value in filters.items():
            if value is not None and hasattr(self.__model__, key):
                q = q.filter(getattr(self.__model__, key) == value)
        return q.offset(skip).limit(limit).all()

    def get(self, db: Session, id: int) -> Optional[ModelT]:
        """Get one record by primary key."""
        return db.query(self.__model__).filter(self.__model__.id == id).first()

    def get_or_404(self, db: Session, id: int, detail: str = "Not found") -> ModelT:
        """Get one record or raise 404."""
        obj = self.get(db, id=id)
        if obj is None:
            raise HTTPException(status_code=404, detail=detail)
        return obj

    def create(self, db: Session, *, schema: CreateSchemaT) -> ModelT:
        """Create a new record."""
        data = self._serialize(schema, exclude_unset=False)
        db_obj = self.__model__(**data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        id: int,
        *,
        schema: UpdateSchemaT,
        detail: str = "Not found",
    ) -> ModelT:
        """Update a record by id."""
        db_obj = self.get_or_404(db, id=id, detail=detail)
        data = self._serialize(schema)
        for field, value in data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, id: int, detail: str = "Not found") -> ModelT:
        """Delete a record by id. Returns the deleted object."""
        db_obj = self.get_or_404(db, id=id, detail=detail)
        db.delete(db_obj)
        db.commit()
        return db_obj
