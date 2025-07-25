"""
Database migration script to add new columns to DynamicPage table
Run this script before starting the application
"""

import psycopg2
from psycopg2 import sql

# Database connection parameters
DB_CONFIG = {
    'host': 'localhost',
    'database': 'star',
    'user': 'postgres',
    'password': '9950'
}

def migrate_database():
    """Add new columns to DynamicPage table"""
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Check if columns already exist
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'dynamic_page' 
            AND column_name IN ('bg_color', 'text_color', 'custom_css')
        """)
        
        existing_columns = [row[0] for row in cursor.fetchall()]
        
        # Add bg_color column if it doesn't exist
        if 'bg_color' not in existing_columns:
            cursor.execute("""
                ALTER TABLE dynamic_page 
                ADD COLUMN bg_color VARCHAR(7) DEFAULT '#ffffff'
            """)
            print("✓ Added bg_color column")
        else:
            print("✓ bg_color column already exists")
        
        # Add text_color column if it doesn't exist
        if 'text_color' not in existing_columns:
            cursor.execute("""
                ALTER TABLE dynamic_page 
                ADD COLUMN text_color VARCHAR(7) DEFAULT '#333333'
            """)
            print("✓ Added text_color column")
        else:
            print("✓ text_color column already exists")
        
        # Add custom_css column if it doesn't exist
        if 'custom_css' not in existing_columns:
            cursor.execute("""
                ALTER TABLE dynamic_page 
                ADD COLUMN custom_css TEXT
            """)
            print("✓ Added custom_css column")
        else:
            print("✓ custom_css column already exists")
        
        # Commit changes
        conn.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_database()
