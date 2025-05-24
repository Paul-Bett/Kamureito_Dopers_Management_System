"""add health birth mating sections

Revision ID: 002
Revises: 001
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None

def upgrade():
    # Create enum types
    op.execute("CREATE TYPE event_type AS ENUM ('vaccination', 'treatment', 'checkup', 'other')")
    op.execute("CREATE TYPE birth_type AS ENUM ('single', 'twin', 'triplet', 'quadruplet')")
    op.execute("CREATE TYPE rearing_type AS ENUM ('natural', 'bottle', 'mixed')")
    op.execute("CREATE TYPE sheep_section AS ENUM ('male', 'general', 'mating')")

    # Create health_events table
    op.create_table(
        'health_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sheep_id', sa.String(), nullable=False),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('event_type', postgresql.ENUM('vaccination', 'treatment', 'checkup', 'other', name='event_type'), nullable=False),
        sa.Column('details', sa.Text(), nullable=False),
        sa.Column('next_due_date', sa.Date(), nullable=True),
        sa.Column('attachments', sa.Text(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=True),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['sheep_id'], ['sheep.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_health_events_id'), 'health_events', ['id'], unique=False)

    # Create birth_records table
    op.create_table(
        'birth_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ewe_id', sa.String(), nullable=False),
        sa.Column('sire_id', sa.String(), nullable=True),
        sa.Column('date_lambed', sa.Date(), nullable=False),
        sa.Column('birth_type', postgresql.ENUM('single', 'twin', 'triplet', 'quadruplet', name='birth_type'), nullable=False),
        sa.Column('rearing_type', postgresql.ENUM('natural', 'bottle', 'mixed', name='rearing_type'), nullable=False),
        sa.Column('dystocia', sa.Boolean(), nullable=True),
        sa.Column('date_weaned', sa.Date(), nullable=True),
        sa.Column('weaning_weight', sa.Float(), nullable=True),
        sa.Column('expected_wean_date', sa.Date(), nullable=True),
        sa.Column('lamb_details', sa.Text(), nullable=True),
        sa.Column('mortality_flag', sa.Boolean(), nullable=True),
        sa.Column('mortality_date', sa.Date(), nullable=True),
        sa.Column('mortality_reason', sa.Text(), nullable=True),
        sa.Column('comments', sa.Text(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=True),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['ewe_id'], ['sheep.id'], ),
        sa.ForeignKeyConstraint(['sire_id'], ['sheep.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_birth_records_id'), 'birth_records', ['id'], unique=False)

    # Create mating_pairs table
    op.create_table(
        'mating_pairs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ram_id', sa.String(), nullable=False),
        sa.Column('ewe_id', sa.String(), nullable=False),
        sa.Column('mating_start_date', sa.Date(), nullable=False),
        sa.Column('expected_lambing_date', sa.Date(), nullable=True),
        sa.Column('actual_lambing_date', sa.Date(), nullable=True),
        sa.Column('group_slot', sa.Integer(), nullable=True),
        sa.Column('pregnancy_confirmed', sa.Boolean(), nullable=True),
        sa.Column('pregnancy_failed', sa.Boolean(), nullable=True),
        sa.Column('failure_reason', sa.Text(), nullable=True),
        sa.Column('override_user', sa.String(), nullable=True),
        sa.Column('override_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=True),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['ewe_id'], ['sheep.id'], ),
        sa.ForeignKeyConstraint(['ram_id'], ['sheep.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_mating_pairs_id'), 'mating_pairs', ['id'], unique=False)

    # Create section_assignments table
    op.create_table(
        'section_assignments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sheep_id', sa.String(), nullable=False),
        sa.Column('section', postgresql.ENUM('male', 'general', 'mating', name='sheep_section'), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.Date(), nullable=True),
        sa.Column('updated_at', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['sheep_id'], ['sheep.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_section_assignments_id'), 'section_assignments', ['id'], unique=False)

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create refresh_tokens table
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token', sa.String(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('is_revoked', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_refresh_tokens_id'), 'refresh_tokens', ['id'], unique=False)
    op.create_index(op.f('ix_refresh_tokens_token'), 'refresh_tokens', ['token'], unique=True)

def downgrade():
    # Drop tables
    op.drop_table('refresh_tokens')
    op.drop_table('users')
    op.drop_table('section_assignments')
    op.drop_table('mating_pairs')
    op.drop_table('birth_records')
    op.drop_table('health_events')

    # Drop enum types
    op.execute('DROP TYPE sheep_section')
    op.execute('DROP TYPE rearing_type')
    op.execute('DROP TYPE birth_type')
    op.execute('DROP TYPE event_type') 