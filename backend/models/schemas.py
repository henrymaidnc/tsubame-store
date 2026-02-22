from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    id: int
    email: EmailStr
    role: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Material schemas
class MaterialBase(BaseModel):
    id: int
    name: str
    unit: str
    quantity: int
    min_stock_level: int
    status: str
    price: float

    class Config:
        from_attributes = True


class MaterialCreate(BaseModel):
    name: str
    unit: str
    quantity: int
    min_stock_level: int
    status: str
    price: float


class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    quantity: Optional[int] = None
    min_stock_level: Optional[int] = None
    status: Optional[str] = None
    price: Optional[float] = None


class ProductMaterialBase(BaseModel):
    id: int
    material_id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    id: int
    name: str
    description: str
    category: str
    price: float
    cost: float
    image: str
    shopee_link: Optional[str] = None

    class Config:
        from_attributes = True


class InventoryBase(BaseModel):
    id: int
    product_id: int
    status: str
    stock: int

    class Config:
        from_attributes = True


class ProductWithInventory(ProductBase):
    inventory: Optional[InventoryBase] = None


class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    cost: float
    image: str
    shopee_link: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    image: Optional[str] = None
    shopee_link: Optional[str] = None


# Distributor schemas
class DistributorBase(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class DistributorDetailBase(BaseModel):
    id: int
    distributor_id: int
    branch: str
    address: str
    contact_name: str
    phone_number: str
    channel: str
    contract: str

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    id: int
    date: datetime
    distributor_detail_id: int
    total_price: float

    class Config:
        from_attributes = True


class OrderDetailBase(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    id: int
    date: datetime
    order_id: int
    method: str
    status: str
    amount: float
    transaction_id: str

    class Config:
        from_attributes = True


# AuditLog schemas
class AuditLogBase(BaseModel):
    id: int
    entity: str
    entity_id: int
    action: str
    changed_by: str
    timestamp: datetime
    details: str

    class Config:
        from_attributes = True
