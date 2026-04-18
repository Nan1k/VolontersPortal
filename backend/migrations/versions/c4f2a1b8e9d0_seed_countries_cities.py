"""seed countries and cities for registration

Revision ID: c4f2a1b8e9d0
Revises: 45222eca504f
Create Date: 2026-04-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "c4f2a1b8e9d0"
down_revision: Union[str, None] = "45222eca504f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Справочник был пустым: миграции только создают таблицы, без INSERT.
    op.execute(
        sa.text(
            """
            INSERT INTO country (country_id, country_name) VALUES
            (1, 'Россия'),
            (2, 'Казахстан'),
            (3, 'Беларусь')
            ON CONFLICT (country_id) DO NOTHING
            """
        )
    )
    op.execute(
        sa.text(
            """
            INSERT INTO city (city_id, city_name, country_id) VALUES
            (1, 'Москва', 1),
            (2, 'Санкт-Петербург', 1),
            (3, 'Екатеринбург', 1),
            (4, 'Новосибирск', 1),
            (5, 'Казань', 1),
            (6, 'Алматы', 2),
            (7, 'Астана', 2),
            (8, 'Минск', 3)
            ON CONFLICT (city_id) DO NOTHING
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM city WHERE city_id IN (1,2,3,4,5,6,7,8)"))
    op.execute(sa.text("DELETE FROM country WHERE country_id IN (1,2,3)"))
