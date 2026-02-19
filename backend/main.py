from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from passlib.hash import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
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

class Product(BaseModel):
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

class Revenue(BaseModel):
    month: str
    konbini: int
    shopee: int
    washi: int
    arimi: int
    airy: int
    total: int

# Mock data - in production, this would come from database
MOCK_USERS = [
    {"id": 1, "email": "admin@tsubame.com", "role": "admin"},
    {"id": 2, "email": "user@tsubame.com", "role": "user"},
]

MOCK_PRODUCTS = [
    {
        "id": 1,
        "name": "Cáo mùa xuân Sticker",
        "category": "Sticker",
        "price": 35000,
        "stock": 142,
        "status": "in-stock",
        "distributor": "Konbini 30%",
        "batch_number": "STK-2025-001",
        "description": "10x10cm waterproof matte laminated sticker + postcard set. Seasonal fox design.",
        "image": "https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Spring"
    },
    {
        "id": 2,
        "name": "Cáo mùa hè Sticker",
        "category": "Sticker",
        "price": 35000,
        "stock": 98,
        "status": "in-stock",
        "distributor": "Shopee",
        "batch_number": "STK-2025-002",
        "description": "Summer fox sticker set with vibrant colors and postcard.",
        "image": "https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Summer"
    },
    {
        "id": 3,
        "name": "Cáo mùa thu Sticker",
        "category": "Sticker",
        "price": 35000,
        "stock": 15,
        "status": "low-stock",
        "distributor": "Washi 30%",
        "batch_number": "STK-2025-003",
        "description": "Autumn fox sticker with warm tones and postcard.",
        "image": "https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Autumn"
    },
    {
        "id": 4,
        "name": "Cáo mùa đông Sticker",
        "category": "Sticker",
        "price": 35000,
        "stock": 0,
        "status": "out-of-stock",
        "distributor": "Arimi",
        "batch_number": "STK-2025-004",
        "description": "Winter fox sticker set in cool blue tones with postcard.",
        "image": "https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Winter"
    },
    {
        "id": 5,
        "name": "Wagashi Sticker",
        "category": "Sticker",
        "price": 35000,
        "stock": 74,
        "status": "in-stock",
        "distributor": "Konbini 30%",
        "batch_number": "STK-2025-005",
        "description": "Japanese wagashi sweets themed sticker + postcard.",
        "image": "https://placehold.co/300x300/1a1f35/4dd9f0?text=🍡+Wagashi"
    }
]

MOCK_REVENUE = [
    {"month": "May 2024", "konbini": 45000000, "shopee": 38000000, "washi": 32000000, "arimi": 28000000, "airy": 25000000, "total": 168000000},
    {"month": "Jun 2024", "konbini": 48000000, "shopee": 42000000, "washi": 35000000, "arimi": 30000000, "airy": 27000000, "total": 182000000},
    {"month": "Jul 2024", "konbini": 52000000, "shopee": 45000000, "washi": 38000000, "arimi": 32000000, "airy": 29000000, "total": 196000000},
    {"month": "Aug 2024", "konbini": 55000000, "shopee": 48000000, "washi": 40000000, "arimi": 35000000, "airy": 31000000, "total": 209000000},
    {"month": "Sep 2024", "konbini": 58000000, "shopee": 50000000, "washi": 42000000, "arimi": 37000000, "airy": 33000000, "total": 220000000},
    {"month": "Oct 2024", "konbini": 60000000, "shopee": 52000000, "washi": 44000000, "arimi": 39000000, "airy": 35000000, "total": 230000000},
    {"month": "Nov 2024", "konbini": 62000000, "shopee": 54000000, "washi": 46000000, "arimi": 41000000, "airy": 37000000, "total": 240000000},
    {"month": "Dec 2024", "konbini": 65000000, "shopee": 58000000, "washi": 50000000, "arimi": 45000000, "airy": 40000000, "total": 258000000},
]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(email: str, password: str):
    user = next((u for u in MOCK_USERS if u["email"] == email), None)
    if not user or not verify_password(password, "hashed_password"):  # In production, compare with stored hash
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        user = next((u for u in MOCK_USERS if u["email"] == email), None)
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception

app = FastAPI(title="Tsubame Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8082"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Tsubame Store API", "version": "1.0.0"}

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/products", response_model=List[Product])
async def get_products():
    return MOCK_PRODUCTS

@app.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/revenue", response_model=List[Revenue])
async def get_revenue():
    return MOCK_REVENUE

@app.get("/revenue/summary")
async def get_revenue_summary():
    total_revenue = sum(item["total"] for item in MOCK_REVENUE)
    average_revenue = total_revenue / len(MOCK_REVENUE)
    max_revenue = max(item["total"] for item in MOCK_REVENUE)
    min_revenue = min(item["total"] for item in MOCK_REVENUE)
    
    return {
        "total_revenue": total_revenue,
        "average_revenue": average_revenue,
        "max_revenue": max_revenue,
        "min_revenue": min_revenue,
        "months_count": len(MOCK_REVENUE)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
