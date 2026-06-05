"""seed demo users for each role

Revision ID: f9e8d7c6b5a4
Revises: c1d2e3f4a5b6
Create Date: 2026-06-05

Демо-аккаунты (пароль для всех: Demo123!):
  volunteer@demo.local   — волонтёр
  cityadmin@demo.local   — админ города
  regionadmin@demo.local — региональный админ
  superadmin@demo.local  — суперадмин
"""
from datetime import datetime
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from passlib.context import CryptContext

revision: str = "f9e8d7c6b5a4"
down_revision: Union[str, None] = "c1d2e3f4a5b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

DEMO_PASSWORD = "Demo123!"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Высокие id, чтобы не пересечься с уже зарегистрированными пользователями.
SEED_USERS = [
    {
        "user_metadata_id": 9001,
        "user_id": 9001,
        "email": "volunteer@demo.local",
        "user_name": "Иван",
        "user_surname": "Волонтёров",
        "user_patronymic": "Петрович",
        "age": "22",
        "is_volunteer": True,
        "is_cityadm": False,
        "is_regionadm": False,
        "is_superadm": False,
    },
    {
        "user_metadata_id": 9002,
        "user_id": 9002,
        "email": "cityadmin@demo.local",
        "user_name": "Анна",
        "user_surname": "Городская",
        "user_patronymic": "Сергеевна",
        "age": "35",
        "is_volunteer": False,
        "is_cityadm": True,
        "is_regionadm": False,
        "is_superadm": False,
    },
    {
        "user_metadata_id": 9003,
        "user_id": 9003,
        "email": "regionadmin@demo.local",
        "user_name": "Олег",
        "user_surname": "Регионов",
        "user_patronymic": "Иванович",
        "age": "41",
        "is_volunteer": False,
        "is_cityadm": False,
        "is_regionadm": True,
        "is_superadm": False,
    },
    {
        "user_metadata_id": 9004,
        "user_id": 9004,
        "email": "superadmin@demo.local",
        "user_name": "Мария",
        "user_surname": "Админова",
        "user_patronymic": "Алексеевна",
        "age": "38",
        "is_volunteer": False,
        "is_cityadm": False,
        "is_regionadm": False,
        "is_superadm": True,
    },
]

SEED_EMAILS = [u["email"] for u in SEED_USERS]


def _insert_user(conn, user: dict, hashed_password: str) -> None:
    conn.execute(
        sa.text(
            """
            INSERT INTO user_metadata (
                user_metadata_id, email, hashed_password, user_name, user_surname,
                user_patronymic, age, "isActive", status, country_id, city_id, volunteer_points
            ) VALUES (
                :user_metadata_id, :email, :hashed_password, :user_name, :user_surname,
                :user_patronymic, :age, true, true, 1, 1, 10000
            )
            ON CONFLICT (email) DO NOTHING
            """
        ),
        {
            "user_metadata_id": user["user_metadata_id"],
            "email": user["email"],
            "hashed_password": hashed_password,
            "user_name": user["user_name"],
            "user_surname": user["user_surname"],
            "user_patronymic": user["user_patronymic"],
            "age": user["age"],
        },
    )

    conn.execute(
        sa.text(
            """
            INSERT INTO "user" (
                user_id, email, hashed_password, createdat, user_metadata_id,
                is_volunteer, is_cityadm, is_regionadm, is_superadm
            ) VALUES (
                :user_id, :email, :hashed_password, :createdat, :user_metadata_id,
                :is_volunteer, :is_cityadm, :is_regionadm, :is_superadm
            )
            ON CONFLICT (email) DO NOTHING
            """
        ),
        {
            "user_id": user["user_id"],
            "email": user["email"],
            "hashed_password": hashed_password,
            "createdat": datetime.utcnow(),
            "user_metadata_id": user["user_metadata_id"],
            "is_volunteer": user["is_volunteer"],
            "is_cityadm": user["is_cityadm"],
            "is_regionadm": user["is_regionadm"],
            "is_superadm": user["is_superadm"],
        },
    )


def upgrade() -> None:
    conn = op.get_bind()
    for user in SEED_USERS:
        exists = conn.execute(
            sa.text("SELECT 1 FROM user_metadata WHERE email = :email"),
            {"email": user["email"]},
        ).fetchone()
        if exists:
            continue
        hashed_password = pwd_context.hash(DEMO_PASSWORD)
        _insert_user(conn, user, hashed_password)


def downgrade() -> None:
    conn = op.get_bind()
    conn.execute(
        sa.text('DELETE FROM "user" WHERE email = ANY(:emails)'),
        {"emails": SEED_EMAILS},
    )
    conn.execute(
        sa.text("DELETE FROM user_metadata WHERE email = ANY(:emails)"),
        {"emails": SEED_EMAILS},
    )
