"""Database session setup.

This module creates the SQLAlchemy engine, session factory, and helpers.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.database.base import Base


engine = create_engine(
	settings.DATABASE_URL,
	pool_pre_ping=True,
)

SessionLocal = sessionmaker(
	bind=engine,
	autoflush=False,
	autocommit=False,
	expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
	"""Provide a database session for FastAPI dependencies."""

	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def create_database() -> None:
	"""Create all database tables defined on the shared SQLAlchemy metadata."""

	Base.metadata.create_all(bind=engine)