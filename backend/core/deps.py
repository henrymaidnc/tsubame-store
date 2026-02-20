"""FastAPI dependencies: DB session, auth."""
from typing import Generator

from sqlalchemy.orm import Session

from models.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """Provide a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
