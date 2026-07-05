"""Commitment domain enumerations.

This module defines the shared enum values used by the Commitment domain.
"""

from enum import Enum


class Priority(str, Enum):
    """Priority levels for a commitment."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Status(str, Enum):
    """Lifecycle states for a commitment."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    MISSED = "missed"
    CANCELLED = "cancelled"


class Category(str, Enum):
    """Commitment categories used to classify different obligation types."""

    ASSIGNMENT = "assignment"
    EXAM = "exam"
    INTERVIEW = "interview"
    MEETING = "meeting"
    PROJECT = "project"
    BILL = "bill"
    HEALTH = "health"
    PERSONAL = "personal"
    EVENT = "event"
    OTHER = "other"


class Source(str, Enum):
    """Sources from which a commitment can originate."""

    MANUAL = "manual"
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    PDF = "pdf"
    IMAGE = "image"
    VOICE = "voice"
    CALENDAR = "calendar"