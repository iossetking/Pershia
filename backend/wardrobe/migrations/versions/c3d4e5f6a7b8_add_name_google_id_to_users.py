"""Add name and google_id to users, make hashed_pw nullable

Revision ID: c3d4e5f6a7b8
Revises: b2d3e5f6a7b8
Create Date: 2026-05-08 16:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2d3e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(table: str, column: str) -> bool:
    conn = op.get_bind()
    result = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_name=:t AND column_name=:c"
        ),
        {"t": table, "c": column},
    )
    return result.fetchone() is not None


def upgrade() -> None:
    if not _column_exists("users", "name"):
        op.add_column("users", sa.Column("name", sa.String(255), nullable=True))

    if not _column_exists("users", "google_id"):
        op.add_column("users", sa.Column("google_id", sa.String(255), nullable=True))
        op.create_unique_constraint("uq_users_google_id", "users", ["google_id"])

    # Make hashed_pw nullable for OAuth users
    op.alter_column("users", "hashed_pw", nullable=True, existing_type=sa.String(255))


def downgrade() -> None:
    op.alter_column("users", "hashed_pw", nullable=False, existing_type=sa.String(255))
    op.drop_constraint("uq_users_google_id", "users", type_="unique")
    op.drop_column("users", "google_id")
    op.drop_column("users", "name")
