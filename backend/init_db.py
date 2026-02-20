from models.database import (
    SessionLocal,
    User,
    Product,
    Inventory,
    Distributor,
    DistributorDetail,
    Order,
    OrderDetail,
    Material,
    ProductMaterial,
    Payment,
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Login credentials created by this script (use for /api/auth/login)
SEED_USERS = [
    {"email": "admin@tsubame.com", "password": "admin123", "role": "admin"},
    {"email": "user@tsubame.com", "password": "user123", "role": "user"},
]


def init_db():
    db = SessionLocal()
    try:
        # Create seed users (skip if already exist so safe to re-run)
        for u in SEED_USERS:
            if db.query(User).filter(User.email == u["email"]).first() is None:
                db.add(User(
                    email=u["email"],
                    hashed_password=pwd_context.hash(u["password"]),
                    role=u["role"],
                ))
        db.commit()

        # If DB already has seed data, skip the rest (safe to re-run)
        if db.query(Material).first() is not None:
            print("Database already has seed data. Users ensured.")
            print("Login: admin@tsubame.com / admin123  or  user@tsubame.com / user123")
            return

        # Create sample Materials
        materials = [
            Material(name="Vinyl Paper", unit="roll", quantity=100, min_stock_level=20, status="In Stock", price=15.0),
            Material(name="Matte Laminate", unit="roll", quantity=50, min_stock_level=10, status="In Stock", price=25.0),
            Material(name="Holographic Film", unit="roll", quantity=10, min_stock_level=5, status="Low Stock", price=50.0)
        ]
        for m in materials:
            db.add(m)
        db.commit()

        # Create sample products
        products = [
            Product(
                id=1, name="Cáo mùa xuân Sticker", category="Sticker", price=35000, cost=10000,
                description="10x10cm waterproof matte laminated sticker + postcard set. Seasonal fox design.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Spring"
            ),
            Product(
                id=2, name="Cáo mùa hè Sticker", category="Sticker", price=35000, cost=10000,
                description="Summer fox sticker set with vibrant colors and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Summer"
            ),
            Product(
                id=3, name="Cáo mùa thu Sticker", category="Sticker", price=35000, cost=10000,
                description="Autumn fox sticker with warm tones and postcard.",
                image="https://placehold.co/300x300/1a1f35/4dd9f0?text=🦊+Autumn"
            )
        ]
        for product in products: db.add(product)
        db.commit()

        # Link Materials to Products
        pm_links = [
            ProductMaterial(material_id=1, product_id=1, quantity=1),
            ProductMaterial(material_id=2, product_id=1, quantity=1),
            ProductMaterial(material_id=1, product_id=2, quantity=1),
            ProductMaterial(material_id=2, product_id=2, quantity=1),
            ProductMaterial(material_id=1, product_id=3, quantity=1)
        ]
        for pm in pm_links: db.add(pm)
        db.commit()

        # Create sample inventories linked to distributors just added
        inventories = [
            Inventory(product_id=1, status="In Stock", stock=142),
            Inventory(product_id=2, status="In Stock", stock=98),
            Inventory(product_id=3, status="Low Stock", stock=15)
        ]
        for inv in inventories: db.add(inv)
        db.commit()

        # Create sample distributors
        distributors = [
            Distributor(id=1, name="Konbini 30%"),
            Distributor(id=2, name="Shopee"),
            Distributor(id=3, name="Washi 30%")
        ]
        for dist in distributors: db.add(dist)
        db.commit()

        distributor_details = [
            DistributorDetail(distributor_id=1, branch="Main", address="123 Tokyo St", contact_name="Aki", phone_number="0912345678", channel="OFFLINE", contract="Standard"),
            DistributorDetail(distributor_id=2, branch="VN", address="Online", contact_name="Bao", phone_number="0987654321", channel="ONLINE", contract="Enterprise"),
            DistributorDetail(distributor_id=3, branch="Main", address="456 Shibuya", contact_name="Chi", phone_number="0901234567", channel="CONSIGNMENT", contract="Standard")
        ]
        for dd in distributor_details: db.add(dd)
        db.commit()

        # Create sample orders linking details 
        orders = [
            Order(id=1, distributor_detail_id=1, total_price=700000), # 20 qty * 35000
            Order(id=2, distributor_detail_id=2, total_price=525000), # 15 qty * 35000
        ]
        for order in orders: db.add(order)
        db.commit()

        order_details = [
            OrderDetail(order_id=1, product_id=1, quantity=20, price=35000),
            OrderDetail(order_id=2, product_id=2, quantity=15, price=35000)
        ]
        for od in order_details: db.add(od)
        db.commit()

        payments = [
            Payment(order_id=1, method="Bank Transfer", status="Completed", amount=700000, transaction_id="TXN12345"),
            Payment(order_id=2, method="Credit Card", status="Pending", amount=525000, transaction_id="TXN67890")
        ]
        for payment in payments: db.add(payment)
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
