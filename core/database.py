from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ✅ Fixed: URL-encoded password

SQLALCHEMY_DATABASE_URL = "postgresql://postgres.esuoooxcrjtafftbdcbs:Dhruvagr%40123@aws-0-us-east-2.pooler.supabase.com:5432/postgres"


# ✅ Removed `check_same_thread` (used only for SQLite)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
