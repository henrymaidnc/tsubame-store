from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", f"postgresql://{os.getenv('POSTGRES_USER', 'postgres')}:{os.getenv('POSTGRES_PASSWORD', 'password')}@postgres:5432/{os.getenv('POSTGRES_DB', 'tsubame_store')}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    price = Column(Integer)
    stock = Column(Integer)
    status = Column(String)
    distributor = Column(String)
    batch_number = Column(String)
    description = Column(Text)
    image = Column(String)

class Revenue(Base):
    __tablename__ = "revenue"
    id = Column(Integer, primary_key=True, index=True)
    month = Column(String)
    konbini = Column(Integer)
    shopee = Column(Integer)
    washi = Column(Integer)
    arimi = Column(Integer)
    airy = Column(Integer)
    total = Column(Integer)
