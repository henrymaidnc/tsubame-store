from pydantic import BaseModel, EmailStr
from typing import Optional, List

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

# Product schemas
class ProductBase(BaseModel):
    id: int
    name: str
    category: str
    price: int
    stock: int
    status: str
    distributor: str
    batch_number: str
    description: str
    image: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    distributor: Optional[str] = None
    batch_number: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None

# Revenue schemas
class RevenueBase(BaseModel):
    id: int
    month: str
    konbini: int
    shopee: int
    washi: int
    arimi: int
    airy: int
    total: int

class RevenueCreate(RevenueBase):
    pass

class RevenueUpdate(BaseModel):
    month: Optional[str] = None
    konbini: Optional[int] = None
    shopee: Optional[int] = None
    washi: Optional[int] = None
    arimi: Optional[int] = None
    airy: Optional[int] = None
    total: Optional[int] = None

class RevenueSummary(BaseModel):
    total_revenue: int
    average_revenue: float
    max_revenue: int
    min_revenue: int
    months_count: int
