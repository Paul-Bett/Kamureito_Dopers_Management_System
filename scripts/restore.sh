#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
DB_NAME="sheep_manager"
DB_USER="postgres"
DB_HOST="localhost"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Please provide a backup file name"
    echo "Usage: $0 <backup_file>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists locally
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    # Try to download from S3 if AWS credentials are configured
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
        echo "Backup file not found locally. Attempting to download from S3..."
        aws s3 cp "s3://$S3_BUCKET/backups/$BACKUP_FILE" "$BACKUP_DIR/$BACKUP_FILE"
        
        if [ $? -ne 0 ]; then
            echo "Failed to download backup from S3"
            exit 1
        fi
    else
        echo "Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
        exit 1
    fi
fi

# Confirm before proceeding
read -p "This will overwrite the current database. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Restore cancelled"
    exit 1
fi

# Stop any existing connections
echo "Stopping existing connections..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '$DB_NAME' 
AND pid <> pg_backend_pid();"

# Drop and recreate database
echo "Dropping and recreating database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore from backup
echo "Restoring database..."
PGPASSWORD=$DB_PASSWORD pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -v "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Database restored successfully"
else
    echo "Database restore failed!"
    exit 1
fi 