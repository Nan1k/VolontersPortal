"""set volunteer_points default to 10000 and backfill existing rows

Revision ID: c1d2e3f4a5b6
Revises: b8c9d0e1f2a3
Create Date: 2026-04-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c1d2e3f4a5b6"
down_revision: Union[str, None] = "b8c9d0e1f2a3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(sa.text("UPDATE user_metadata SET volunteer_points = 10000 WHERE volunteer_points < 10000"))
    op.alter_column(
        "user_metadata",
        "volunteer_points",
        existing_type=sa.Integer(),
        server_default="10000",
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "user_metadata",
        "volunteer_points",
        existing_type=sa.Integer(),
        server_default="100",
        existing_nullable=False,
    )
