"""add Irkutsk to city catalog

Revision ID: e7f8a9b0c1d2
Revises: d5a6b7c8e9f0
Create Date: 2026-04-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "e7f8a9b0c1d2"
down_revision: Union[str, None] = "d5a6b7c8e9f0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            INSERT INTO city (city_id, city_name, country_id) VALUES
            (9, 'Иркутск', 1)
            ON CONFLICT (city_id) DO NOTHING
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM city WHERE city_id = 9"))
