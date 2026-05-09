"""Add layout columns to outfits_garments

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-05-09 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, Sequence[str], None] = 'c3d4e5f6a7b8'
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
    if not _column_exists("outfits_garments", "pos_top"):
        op.add_column("outfits_garments", sa.Column("pos_top", sa.Float(), nullable=True, server_default="0"))
    if not _column_exists("outfits_garments", "pos_left"):
        op.add_column("outfits_garments", sa.Column("pos_left", sa.Float(), nullable=True, server_default="0"))
    if not _column_exists("outfits_garments", "pos_scale"):
        op.add_column("outfits_garments", sa.Column("pos_scale", sa.Float(), nullable=True, server_default="80"))
    if not _column_exists("outfits_garments", "pos_z_index"):
        op.add_column("outfits_garments", sa.Column("pos_z_index", sa.Integer(), nullable=True, server_default="1"))


def downgrade() -> None:
    op.drop_column("outfits_garments", "pos_z_index")
    op.drop_column("outfits_garments", "pos_scale")
    op.drop_column("outfits_garments", "pos_left")
    op.drop_column("outfits_garments", "pos_top")
