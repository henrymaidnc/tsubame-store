"""Material CRUD using BaseCRUD pattern."""
from crud.base import BaseCRUD
from models.database import Material
from models.schemas import MaterialCreate, MaterialUpdate


class MaterialCRUD(BaseCRUD[Material, MaterialCreate, MaterialUpdate]):
    __model__ = Material


material_crud = MaterialCRUD()
