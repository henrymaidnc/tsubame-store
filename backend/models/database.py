from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
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

from datetime import datetime

class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit = Column(String)
    quantity = Column(Integer)
    min_stock_level = Column(Integer)
    status = Column(String) # For Enum
    price = Column(Float)

    product_materials = relationship("ProductMaterial", back_populates="material")

class ProductMaterial(Base):
    __tablename__ = "product_materials"
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("materials.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)

    material = relationship("Material", back_populates="product_materials")
    product = relationship("Product", back_populates="product_materials")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    category = Column(String)
    price = Column(Float)
    cost = Column(Float)
    image = Column(String)

    product_materials = relationship("ProductMaterial", back_populates="product")
    inventory = relationship("Inventory", back_populates="product", uselist=False)
    order_details = relationship("OrderDetail", back_populates="product")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, index=True)
    status = Column(String) # For Enum: In Stock, Sold Out, Low Stock
    stock = Column(Integer)

    product = relationship("Product", back_populates="inventory")

class Distributor(Base):
    __tablename__ = "distributors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    details = relationship("DistributorDetail", back_populates="distributor")

class DistributorDetail(Base):
    __tablename__ = "distributor_details"
    id = Column(Integer, primary_key=True, index=True)
    distributor_id = Column(Integer, ForeignKey("distributors.id"))
    branch = Column(String)
    address = Column(String)
    contact_name = Column(String)
    phone_number = Column(String)
    channel = Column(String) # For Enum: OFFLINE, ONLINE, CONSIGNMENT
    contract = Column(String)

    distributor = relationship("Distributor", back_populates="details")
    orders = relationship("Order", back_populates="distributor_detail")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    distributor_detail_id = Column(Integer, ForeignKey("distributor_details.id"))
    total_price = Column(Float)

    distributor_detail = relationship("DistributorDetail", back_populates="orders")
    order_details = relationship("OrderDetail", back_populates="order")
    payments = relationship("Payment", back_populates="order")

class OrderDetail(Base):
    __tablename__ = "order_details"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)

    order = relationship("Order", back_populates="order_details")
    product = relationship("Product", back_populates="order_details")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    order_id = Column(Integer, ForeignKey("orders.id"))
    method = Column(String)
    status = Column(String)
    amount = Column(Float)
    transaction_id = Column(String)

    order = relationship("Order", back_populates="payments")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    entity = Column(String)
    entity_id = Column(Integer)
    action = Column(String)
    changed_by = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(Text)
