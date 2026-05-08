"""Add description to garments

Revision ID: b2d3e5f6a7b8
Revises: a1cfa4a2ac22
Create Date: 2026-05-08 15:01:46.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'b2d3e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'a1cfa4a2ac22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    result = conn.execute(
        sa.text("SELECT 1 FROM information_schema.columns WHERE table_name='garments' AND column_name='description'")
    )
    if not result.fetchone():
        op.add_column('garments', sa.Column('description', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('garments', 'description')
