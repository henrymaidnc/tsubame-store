# CRUD package: BaseCRUD and module-specific CRUD classes
from crud.base import BaseCRUD
from crud.product import product_crud
from crud.material import material_crud

__all__ = ["BaseCRUD", "product_crud", "material_crud"]
