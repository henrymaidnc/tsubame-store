import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", f"postgresql://{os.getenv('POSTGRES_USER', 'postgres')}:{os.getenv('POSTGRES_PASSWORD', 'password')}@postgres:5432/{os.getenv('POSTGRES_DB', 'tsubame_store')}")
engine = create_engine(DATABASE_URL)

def run_migration():
    with engine.begin() as conn:
        print("Starting migration...")
        
        # 1. Create the new inventory table
        print("Creating inventory table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,
                product_id INTEGER,
                number INTEGER,
                distributor VARCHAR
            );
            CREATE INDEX IF NOT EXISTS ix_inventory_id ON inventory (id);
            CREATE INDEX IF NOT EXISTS ix_inventory_product_id ON inventory (product_id);

            CREATE TABLE IF NOT EXISTS distributors (
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                contact_name VARCHAR,
                mobile_phone VARCHAR,
                address VARCHAR,
                branch VARCHAR
            );
            CREATE INDEX IF NOT EXISTS ix_distributors_id ON distributors (id);
            CREATE INDEX IF NOT EXISTS ix_distributors_name ON distributors (name);

            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                inventory_id INTEGER,
                distributor_id INTEGER,
                number INTEGER
            );
            CREATE INDEX IF NOT EXISTS ix_orders_id ON orders (id);
            CREATE INDEX IF NOT EXISTS ix_orders_inventory_id ON orders (inventory_id);
            CREATE INDEX IF NOT EXISTS ix_orders_distributor_id ON orders (distributor_id);
        """))

        # 2. Check if we have the old columns to migrate
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' and column_name='stock';
        """)).fetchone()

        if result:
            print("Migrating data from products to inventory...")
            # Insert existing stock and distributor into inventory
            conn.execute(text("""
                INSERT INTO inventory (product_id, number, distributor)
                SELECT id, stock, distributor FROM products;
            """))

            print("Migrating unique distributors to new table...")
            conn.execute(text("""
                INSERT INTO distributors (name, contact_name, mobile_phone, address, branch)
                SELECT DISTINCT distributor, 'Unknown Contact', '0000000000', 'Unknown Address', 'Main'
                FROM products 
                WHERE distributor IS NOT NULL AND distributor != '';
            """))

            print("Creating mock orders for the migrated inventory...")
            conn.execute(text("""
                INSERT INTO orders (inventory_id, distributor_id, number)
                SELECT i.id, d.id, 10
                FROM inventory i
                JOIN distributors d ON i.distributor = d.name;
            """))

            print("Altering products table (renaming and dropping columns)...")
            # Rename price to amount
            conn.execute(text("ALTER TABLE products RENAME COLUMN price TO amount;"))
            
            # Drop obsolete columns
            conn.execute(text("ALTER TABLE products DROP COLUMN stock;"))
            conn.execute(text("ALTER TABLE products DROP COLUMN status;"))
            conn.execute(text("ALTER TABLE products DROP COLUMN distributor;"))
            conn.execute(text("ALTER TABLE products DROP COLUMN batch_number;"))
            
            print("Migration successful: Products split into Product + Inventory!")
        else:
            print("Migration already applied or old columns do not exist.")

if __name__ == "__main__":
    run_migration()
