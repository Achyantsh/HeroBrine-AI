"""Add user_id column to commitments table.

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-09
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: Union[str, None] = "f154bdf8a6ad"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "commitments",
        sa.Column("user_id", sa.String(255), nullable=True),
    )
    op.create_index("ix_commitments_user_id", "commitments", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_commitments_user_id", table_name="commitments")
    op.drop_column("commitments", "user_id")