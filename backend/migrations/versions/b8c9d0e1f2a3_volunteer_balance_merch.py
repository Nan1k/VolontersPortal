"""volunteer_points and merch_redemption

Revision ID: b8c9d0e1f2a3
Revises: e7f8a9b0c1d2
Create Date: 2026-04-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b8c9d0e1f2a3"
down_revision: Union[str, None] = "e7f8a9b0c1d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_metadata",
        sa.Column("volunteer_points", sa.Integer(), nullable=False, server_default="10000"),
    )
    op.create_table(
        "merch_redemption",
        sa.Column("redemption_id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_metadata_id", sa.Integer(), nullable=False),
        sa.Column("item_id", sa.String(length=64), nullable=False),
        sa.Column("item_title", sa.String(length=200), nullable=False),
        sa.Column("points_cost", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_metadata_id"],
            ["user_metadata.user_metadata_id"],
            onupdate="CASCADE",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("redemption_id"),
    )
    op.create_index(
        op.f("ix_merch_redemption_user_metadata_id"),
        "merch_redemption",
        ["user_metadata_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_merch_redemption_user_metadata_id"), table_name="merch_redemption")
    op.drop_table("merch_redemption")
    op.drop_column("user_metadata", "volunteer_points")
