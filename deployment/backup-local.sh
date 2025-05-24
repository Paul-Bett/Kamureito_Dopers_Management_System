#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="sheep_manager_dev"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Load environment variables
if [ -f .env.development ]; then
    export $(cat .env.development | xargs)
fi

# Create backup
echo "Creating backup..."
PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/backup_$TIMESTAMP.dump"

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: backup_$TIMESTAMP.dump"
    
    # Keep only the last 5 backups
    echo "Cleaning up old backups..."
    ls -t $BACKUP_DIR/backup_*.dump | tail -n +6 | xargs -r rm
    
    echo "Backup process completed!"
else
    echo "Backup failed!"
    exit 1
fi 