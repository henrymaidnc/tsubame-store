"""Product CRUD using BaseCRUD pattern."""
from crud.base import BaseCRUD
from models.database import Product
from models.schemas import ProductCreate, ProductUpdate


class ProductCRUD(BaseCRUD[Product, ProductCreate, ProductUpdate]):
    __model__ = Product


# Singleton instance for dependency injection and direct use
product_crud = ProductCRUD()
