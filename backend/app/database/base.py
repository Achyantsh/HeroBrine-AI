"""Shared SQLAlchemy base class.

This module defines the declarative base used by all ORM models.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
	"""Base class for all SQLAlchemy declarative models."""