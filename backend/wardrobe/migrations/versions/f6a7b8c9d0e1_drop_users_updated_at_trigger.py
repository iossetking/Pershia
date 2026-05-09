"""Drop stale update_users_modtime trigger

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-05-09 14:00:00.000000

"""
from typing import Sequence, Union
from alembic import op

revision: str = 'f6a7b8c9d0e1'
down_revision: Union[str, Sequence[str], None] = 'e5f6a7b8c9d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS update_users_modtime ON users")


def downgrade() -> None:
    op.execute("""
        CREATE TRIGGER update_users_modtime
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_modified_column()
    """)
