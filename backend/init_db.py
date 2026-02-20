from sqlalchemy.orm import Session
from main import engine, SessionLocal, User, Product, Inventory, Distributor, Order
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
                amount=35000,
                description="10x10cm waterproof matte laminated sticker + postcard set. Seasonal fox design.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Spring"
            ),
            Product(
                id=2,
                name="Cáo mùa hè Sticker",
                category="Sticker",
                amount=35000,
                description="Summer fox sticker set with vibrant colors and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Summer"
            ),
            Product(
                id=3,
                name="Cáo mùa thu Sticker",
                category="Sticker",
                amount=35000,
                description="Autumn fox sticker with warm tones and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Autumn"
            ),
            Product(
                id=4,
                name="Cáo mùa đông Sticker",
                category="Sticker",
                amount=35000,
                description="Winter fox sticker set in cool blue tones with postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Winter"
            ),
            Product(
                id=5,
                name="Wagashi Sticker",
                category="Sticker",
                amount=35000,
                description="Japanese wagashi sweets themed sticker + postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🍡+Wagashi"
            )
        ]
        
        for product in products:
            db.add(product)

        db.commit()

        # Create sample distributors
        distributors = [
            Distributor(id=1, name="Konbini 30%", contact_name="Aki", mobile_phone="0912345678", address="123 Tokyo St", branch="Main"),
            Distributor(id=2, name="Shopee", contact_name="Bao", mobile_phone="0987654321", address="Online", branch="VN"),
            Distributor(id=3, name="Washi 30%", contact_name="Chi", mobile_phone="0901234567", address="456 Shibuya", branch="Main"),
            Distributor(id=4, name="Arimi", contact_name="Dung", mobile_phone="0934567890", address="789 Kyoto", branch="Store 1")
        ]
        
        for dist in distributors:
            db.add(dist)
            
        db.commit()

        # Create sample inventories linked to distributors just added
        inventories = [
            Inventory(product_id=1, number=142, distributor="Konbini 30%"),
            Inventory(product_id=2, number=98, distributor="Shopee"),
            Inventory(product_id=3, number=15, distributor="Washi 30%"),
            Inventory(product_id=4, number=0, distributor="Arimi"),
            Inventory(product_id=5, number=74, distributor="Konbini 30%")
        ]

        for inv in inventories:
            db.add(inv)
            
        db.commit()
        
        # Create sample orders linking inventory to distributors
        orders = [
            Order(inventory_id=1, distributor_id=1, number=20),
            Order(inventory_id=2, distributor_id=2, number=15),
            Order(inventory_id=3, distributor_id=3, number=5),
            Order(inventory_id=5, distributor_id=1, number=30)
        ]
        
        for order in orders:
            db.add(order)
            
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
