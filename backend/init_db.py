from sqlalchemy.orm import Session
from main import engine, SessionLocal, User, Product, Revenue
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    db = SessionLocal()
    try:
        # Create admin user
        admin_user = User(
            email="admin@tsubame.com",
            hashed_password=pwd_context.hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        
        # Create regular user
        regular_user = User(
            email="user@tsubame.com", 
            hashed_password=pwd_context.hash("user123"),
            role="user"
        )
        db.add(regular_user)
        
        # Create sample products
        products = [
            Product(
                id=1,
                name="Cáo mùa xuân Sticker",
                category="Sticker",
                price=35000,
                stock=142,
                status="in-stock",
                distributor="Konbini 30%",
                batch_number="STK-2025-001",
                description="10x10cm waterproof matte laminated sticker + postcard set. Seasonal fox design.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Spring"
            ),
            Product(
                id=2,
                name="Cáo mùa hè Sticker",
                category="Sticker",
                price=35000,
                stock=98,
                status="in-stock",
                distributor="Shopee",
                batch_number="STK-2025-002",
                description="Summer fox sticker set with vibrant colors and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Summer"
            ),
            Product(
                id=3,
                name="Cáo mùa thu Sticker",
                category="Sticker",
                price=35000,
                stock=15,
                status="low-stock",
                distributor="Washi 30%",
                batch_number="STK-2025-003",
                description="Autumn fox sticker with warm tones and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Autumn"
            ),
            Product(
                id=4,
                name="Cáo mùa đông Sticker",
                category="Sticker",
                price=35000,
                stock=0,
                status="out-of-stock",
                distributor="Arimi",
                batch_number="STK-2025-004",
                description="Winter fox sticker set in cool blue tones with postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Winter"
            ),
            Product(
                id=5,
                name="Wagashi Sticker",
                category="Sticker",
                price=35000,
                stock=74,
                status="in-stock",
                distributor="Konbini 30%",
                batch_number="STK-2025-005",
                description="Japanese wagashi sweets themed sticker + postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🍡+Wagashi"
            )
        ]
        
        for product in products:
            db.add(product)
        
        # Create sample revenue data
        revenue_data = [
            Revenue(
                month="May 2024",
                konbini=45000000,
                shopee=38000000,
                washi=32000000,
                arimi=28000000,
                airy=25000000,
                total=168000000
            ),
            Revenue(
                month="Jun 2024",
                konbini=48000000,
                shopee=42000000,
                washi=35000000,
                arimi=30000000,
                airy=27000000,
                total=182000000
            ),
            Revenue(
                month="Jul 2024",
                konbini=52000000,
                shopee=45000000,
                washi=38000000,
                arimi=32000000,
                airy=29000000,
                total=196000000
            ),
            Revenue(
                month="Aug 2024",
                konbini=55000000,
                shopee=48000000,
                washi=40000000,
                arimi=35000000,
                airy=31000000,
                total=209000000
            ),
            Revenue(
                month="Sep 2024",
                konbini=58000000,
                shopee=50000000,
                washi=42000000,
                arimi=37000000,
                airy=33000000,
                total=220000000
            ),
            Revenue(
                month="Oct 2024",
                konbini=60000000,
                shopee=52000000,
                washi=44000000,
                arimi=39000000,
                airy=35000000,
                total=230000000
            ),
            Revenue(
                month="Nov 2024",
                konbini=62000000,
                shopee=54000000,
                washi=46000000,
                arimi=41000000,
                airy=37000000,
                total=240000000
            ),
            Revenue(
                month="Dec 2024",
                konbini=65000000,
                shopee=58000000,
                washi=50000000,
                arimi=45000000,
                airy=40000000,
                total=258000000
            )
        ]
        
        for revenue in revenue_data:
            db.add(revenue)
        
        db.commit()
        print("Database initialized successfully!")
        print("Users created:")
        print("- admin@tsubame.com (password: admin123)")
        print("- user@tsubame.com (password: user123)")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
