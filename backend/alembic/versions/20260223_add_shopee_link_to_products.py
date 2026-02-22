"""Add shopee_link to products

Revision ID: add_shopee_link
Revises: c433fe3b483f
Create Date: 2026-02-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "add_shopee_link"
down_revision: Union[str, None] = "c433fe3b483f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("shopee_link", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "shopee_link")

