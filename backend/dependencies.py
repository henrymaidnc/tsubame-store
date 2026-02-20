from sqlalchemy.orm import Session

def get_db():
    from models.database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
