from sqlalchemy.orm import Session
from models.database import User, Product, Revenue
from models.schemas import UserCreate, ProductCreate, ProductUpdate, RevenueCreate, RevenueUpdate
from passlib.context import CryptContext
from typing import Optional, List
from fastapi import HTTPException, status

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User services
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# Product services
def get_products(db: Session) -> List[Product]:
    return db.query(Product).all()

def get_product_by_id(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

def create_product(db: Session, product: ProductCreate) -> Product:
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: ProductUpdate) -> Product:
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int) -> Product:
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return product

# Revenue services
def get_revenue_data(db: Session) -> List[Revenue]:
    return db.query(Revenue).all()

def get_revenue_by_id(db: Session, revenue_id: int) -> Optional[Revenue]:
    return db.query(Revenue).filter(Revenue.id == revenue_id).first()

def create_revenue(db: Session, revenue: RevenueCreate) -> Revenue:
    db_revenue = Revenue(**revenue.dict())
    db.add(db_revenue)
    db.commit()
    db.refresh(db_revenue)
    return db_revenue

def update_revenue(db: Session, revenue_id: int, revenue: RevenueUpdate) -> Revenue:
    db_revenue = get_revenue_by_id(db, revenue_id)
    if not db_revenue:
        raise HTTPException(status_code=404, detail="Revenue data not found")
    
    update_data = revenue.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_revenue, field, value)
    
    db.commit()
    db.refresh(db_revenue)
    return db_revenue

def delete_revenue(db: Session, revenue_id: int) -> Revenue:
    revenue = get_revenue_by_id(db, revenue_id)
    if not revenue:
        raise HTTPException(status_code=404, detail="Revenue data not found")
    
    db.delete(revenue)
    db.commit()
    return revenue

def get_revenue_summary(db: Session):
    revenue_data = get_revenue_data(db)
    if not revenue_data:
        return {
            "total_revenue": 0,
            "average_revenue": 0,
            "max_revenue": 0,
            "min_revenue": 0,
            "months_count": 0
        }
    
    total_revenue = sum(item.total for item in revenue_data)
    months_count = len(revenue_data)
    average_revenue = total_revenue / months_count if months_count > 0 else 0
    max_revenue = max(item.total for item in revenue_data) if revenue_data else 0
    min_revenue = min(item.total for item in revenue_data) if revenue_data else 0
    
    return {
        "total_revenue": total_revenue,
        "average_revenue": average_revenue,
        "max_revenue": max_revenue,
        "min_revenue": min_revenue,
        "months_count": months_count
    }
