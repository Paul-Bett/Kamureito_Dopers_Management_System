from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.models.sheep import Sheep, SheepStatus
from app.schemas.sheep import SheepCreate, SheepUpdate, SheepFilter


def create_sheep(db: Session, sheep_in: SheepCreate) -> Sheep:
    """Create a new sheep record."""
    db_sheep = Sheep(**sheep_in.model_dump())
    db.add(db_sheep)
    db.commit()
    db.refresh(db_sheep)
    return db_sheep


def get_sheep(db: Session, tag_id: str) -> Optional[Sheep]:
    """Get a sheep by tag ID."""
    return db.query(Sheep).filter(Sheep.tag_id == tag_id).first()


def update_sheep(db: Session, tag_id: str, sheep_in: SheepUpdate) -> Optional[Sheep]:
    """Update a sheep record."""
    db_sheep = get_sheep(db, tag_id)
    if not db_sheep:
        return None
    
    update_data = sheep_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sheep, field, value)
    
    db.commit()
    db.refresh(db_sheep)
    return db_sheep


def delete_sheep(db: Session, tag_id: str) -> bool:
    """Delete a sheep record."""
    db_sheep = get_sheep(db, tag_id)
    if not db_sheep:
        return False
    
    db.delete(db_sheep)
    db.commit()
    return True


def list_sheep(db: Session, filters: SheepFilter) -> List[Sheep]:
    """List sheep records with optional filtering."""
    query = db.query(Sheep)
    
    if filters.status:
        query = query.filter(Sheep.status == filters.status)
    if filters.sex:
        query = query.filter(Sheep.sex == filters.sex)
    if filters.section:
        query = query.filter(Sheep.current_section == filters.section)
    if filters.breed:
        query = query.filter(Sheep.breed == filters.breed)
    
    return query.all()


def generate_tag_id(db: Session, color_code: str) -> str:
    """Generate the next available tag ID for a given color code."""
    # Get the highest existing number for this color code
    existing = db.query(Sheep.tag_id).filter(
        Sheep.tag_id.like(f"{color_code}-%")
    ).all()
    
    if not existing:
        return f"{color_code}-001"
    
    # Extract numbers and find the highest
    numbers = []
    for tag_id in existing:
        try:
            num = int(tag_id.split("-")[1])
            numbers.append(num)
        except (IndexError, ValueError):
            continue
    
    next_num = max(numbers) + 1 if numbers else 1
    return f"{color_code}-{next_num:03d}"


def check_inbreeding(db: Session, ram_id: str, ewe_id: str, generations: int = 3) -> bool:
    """Check if a mating pair would result in inbreeding within the specified generations."""
    def get_ancestors(sheep_id: str, depth: int, current_depth: int = 0) -> set:
        if current_depth >= depth:
            return set()
        
        sheep = get_sheep(db, sheep_id)
        if not sheep:
            return set()
        
        ancestors = {sheep_id}
        if sheep.sire_id:
            ancestors.update(get_ancestors(sheep.sire_id, depth, current_depth + 1))
        if sheep.dam_id:
            ancestors.update(get_ancestors(sheep.dam_id, depth, current_depth + 1))
        return ancestors
    
    ram_ancestors = get_ancestors(ram_id, generations)
    ewe_ancestors = get_ancestors(ewe_id, generations)
    
    # Check for common ancestors
    return bool(ram_ancestors.intersection(ewe_ancestors)) 