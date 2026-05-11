"""Add embedding column to garments

Revision ID: g7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-05-10 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op

revision: str = 'g7b8c9d0e1f2'
down_revision: Union[str, Sequence[str], None] = 'f6a7b8c9d0e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.execute("ALTER TABLE garments ADD COLUMN IF NOT EXISTS embedding vector(1024)")


def downgrade() -> None:
    op.execute("ALTER TABLE garments DROP COLUMN IF EXISTS embedding")
