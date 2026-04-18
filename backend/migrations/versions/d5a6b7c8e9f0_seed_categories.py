"""seed default event categories

Revision ID: d5a6b7c8e9f0
Revises: c4f2a1b8e9d0
Create Date: 2026-04-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "d5a6b7c8e9f0"
down_revision: Union[str, None] = "c4f2a1b8e9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            INSERT INTO category (category_id, category_name) VALUES
            (1, 'Экология'),
            (2, 'Спорт'),
            (3, 'Культура'),
            (4, 'Образование'),
            (5, 'Медицина'),
            (6, 'Социальная помощь')
            ON CONFLICT (category_id) DO NOTHING
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM category WHERE category_id IN (1,2,3,4,5,6)"))
