"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create enum types
    op.execute("CREATE TYPE sheep_status AS ENUM ('active', 'sold', 'deceased')")
    op.execute("CREATE TYPE sheep_sex AS ENUM ('male', 'female')")
    op.execute("CREATE TYPE sheep_section AS ENUM ('male', 'general', 'mating')")
    op.execute("CREATE TYPE event_type AS ENUM ('vaccination', 'treatment', 'checkup', 'other')")
    op.execute("CREATE TYPE birth_type AS ENUM ('single', 'twin', 'triplet', 'quadruplet')")
    op.execute("CREATE TYPE rearing_type AS ENUM ('natural', 'bottle', 'mixed')")

    # Create sheep table
    op.create_table(
        'sheep',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tag_id', sa.String(20), nullable=False),
        sa.Column('scrapie_id', sa.String(50), nullable=True),
        sa.Column('breed', sa.String(50), nullable=False),
        sa.Column('sex', postgresql.ENUM('male', 'female', name='sheep_sex'), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('purchase_date', sa.Date(), nullable=True),
        sa.Column('sale_date', sa.Date(), nullable=True),
        sa.Column('death_date', sa.Date(), nullable=True),
        sa.Column('acquisition_price', sa.Numeric(10, 2), nullable=True),
        sa.Column('sale_price', sa.Numeric(10, 2), nullable=True),
        sa.Column('status', postgresql.ENUM('active', 'sold', 'deceased', name='sheep_status'), nullable=False),
        sa.Column('current_section', postgresql.ENUM('male', 'general', 'mating', name='sheep_section'), nullable=False),
        sa.Column('origin_farm', sa.String(100), nullable=True),
        sa.Column('rfid_code', sa.String(50), nullable=True),
        sa.Column('qr_code', sa.String(50), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('sire_id', sa.String(20), nullable=True),
        sa.Column('dam_id', sa.String(20), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tag_id'),
        sa.UniqueConstraint('scrapie_id'),
        sa.UniqueConstraint('rfid_code'),
        sa.UniqueConstraint('qr_code'),
        sa.ForeignKeyConstraint(['sire_id'], ['sheep.tag_id']),
        sa.ForeignKeyConstraint(['dam_id'], ['sheep.tag_id'])
    )
    op.create_index('ix_sheep_tag_id', 'sheep', ['tag_id'])

    # Create health_events table
    op.create_table(
        'health_events',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sheep_id', sa.String(20), nullable=False),
        sa.Column('event_date', sa.Date(), nullable=False),
        sa.Column('event_type', postgresql.ENUM('vaccination', 'treatment', 'checkup', 'other', name='event_type'), nullable=False),
        sa.Column('details', sa.Text(), nullable=False),
        sa.Column('next_due_date', sa.Date(), nullable=True),
        sa.Column('attachments', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['sheep_id'], ['sheep.tag_id'])
    )

    # Create birth_records table
    op.create_table(
        'birth_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ewe_id', sa.String(20), nullable=False),
        sa.Column('sire_id', sa.String(20), nullable=False),
        sa.Column('date_lambed', sa.Date(), nullable=False),
        sa.Column('birth_type', postgresql.ENUM('single', 'twin', 'triplet', 'quadruplet', name='birth_type'), nullable=False),
        sa.Column('rearing_type', postgresql.ENUM('natural', 'bottle', 'mixed', name='rearing_type'), nullable=False),
        sa.Column('dystocia', sa.Boolean(), nullable=False),
        sa.Column('date_weaned', sa.Date(), nullable=True),
        sa.Column('weaning_weight', sa.Numeric(5, 2), nullable=True),
        sa.Column('expected_wean_date', sa.Date(), nullable=True),
        sa.Column('lamb_details', sa.Text(), nullable=True),
        sa.Column('mortality_flag', sa.Boolean(), nullable=False),
        sa.Column('mortality_date', sa.Date(), nullable=True),
        sa.Column('mortality_reason', sa.Text(), nullable=True),
        sa.Column('comments', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['ewe_id'], ['sheep.tag_id']),
        sa.ForeignKeyConstraint(['sire_id'], ['sheep.tag_id'])
    )

    # Create mating_pairs table
    op.create_table(
        'mating_pairs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ram_id', sa.String(20), nullable=False),
        sa.Column('ewe_id', sa.String(20), nullable=False),
        sa.Column('mating_start_date', sa.Date(), nullable=False),
        sa.Column('expected_lambing_date', sa.Date(), nullable=False),
        sa.Column('actual_lambing_date', sa.Date(), nullable=True),
        sa.Column('group_slot', sa.Integer(), nullable=False),
        sa.Column('pregnancy_confirmed', sa.Boolean(), nullable=False),
        sa.Column('pregnancy_failed', sa.Boolean(), nullable=False),
        sa.Column('failure_reason', sa.Text(), nullable=True),
        sa.Column('override_user', sa.String(50), nullable=True),
        sa.Column('override_reason', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['ram_id'], ['sheep.tag_id']),
        sa.ForeignKeyConstraint(['ewe_id'], ['sheep.tag_id'])
    )

    # Create section_assignments table
    op.create_table(
        'section_assignments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sheep_id', sa.String(20), nullable=False),
        sa.Column('section', postgresql.ENUM('male', 'general', 'mating', name='sheep_section'), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['sheep_id'], ['sheep.tag_id'])
    )

def downgrade():
    op.drop_table('section_assignments')
    op.drop_table('mating_pairs')
    op.drop_table('birth_records')
    op.drop_table('health_events')
    op.drop_table('sheep')
    
    # Drop enum types
    op.execute('DROP TYPE sheep_status')
    op.execute('DROP TYPE sheep_sex')
    op.execute('DROP TYPE sheep_section')
    op.execute('DROP TYPE event_type')
    op.execute('DROP TYPE birth_type')
    op.execute('DROP TYPE rearing_type') 