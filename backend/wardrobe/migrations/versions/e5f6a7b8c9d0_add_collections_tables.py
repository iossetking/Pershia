"""Add collections tables

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-05-09 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'e5f6a7b8c9d0'
down_revision: Union[str, Sequence[str], None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists(table: str) -> bool:
    conn = op.get_bind()
    result = conn.execute(
        sa.text("SELECT 1 FROM information_schema.tables WHERE table_name = :t"),
        {"t": table},
    )
    return result.fetchone() is not None


def upgrade() -> None:
    if not _table_exists("collections"):
        op.create_table(
            "collections",
            sa.Column("collection_id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("title", sa.String(length=255), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("is_public", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.ForeignKeyConstraint(["user_id"], ["users.user_id"]),
            sa.PrimaryKeyConstraint("collection_id"),
        )

    if not _table_exists("collections_garments"):
        op.create_table(
            "collections_garments",
            sa.Column("collection_id", sa.Integer(), nullable=False),
            sa.Column("garment_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["collection_id"], ["collections.collection_id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["garment_id"], ["garments.garment_id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("collection_id", "garment_id"),
        )

    if not _table_exists("collections_outfits"):
        op.create_table(
            "collections_outfits",
            sa.Column("collection_id", sa.Integer(), nullable=False),
            sa.Column("outfit_id", sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(["collection_id"], ["collections.collection_id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["outfit_id"], ["outfits.outfit_id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("collection_id", "outfit_id"),
        )


def downgrade() -> None:
    op.drop_table("collections_outfits")
    op.drop_table("collections_garments")
    op.drop_table("collections")
