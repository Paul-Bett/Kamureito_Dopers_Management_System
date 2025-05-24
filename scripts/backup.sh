#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="sheep_manager"
DB_USER="postgres"
DB_HOST="localhost"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating backup..."
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/backup_$TIMESTAMP.dump"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: backup_$TIMESTAMP.dump"
    
    # Upload to S3 (if AWS credentials are configured)
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
        echo "Uploading backup to S3..."
        aws s3 cp "$BACKUP_DIR/backup_$TIMESTAMP.dump" "s3://$S3_BUCKET/backups/backup_$TIMESTAMP.dump"
        
        if [ $? -eq 0 ]; then
            echo "Backup uploaded to S3 successfully"
        else
            echo "Failed to upload backup to S3"
        fi
    fi
    
    # Clean up old backups
    echo "Cleaning up old backups..."
    find $BACKUP_DIR -name "backup_*.dump" -type f -mtime +$RETENTION_DAYS -delete
    
    # Clean up old S3 backups
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
        aws s3 ls "s3://$S3_BUCKET/backups/" | while read -r line; do
            createDate=$(echo $line | awk {'print $1" "$2'})
            createDate=$(date -d "$createDate" +%s)
            olderThan=$(date -d "-$RETENTION_DAYS days" +%s)
            if [[ $createDate -lt $olderThan ]]; then
                fileName=$(echo $line | awk {'print $4'})
                aws s3 rm "s3://$S3_BUCKET/backups/$fileName"
            fi
        done
    fi
else
    echo "Backup failed!"
    exit 1
fi 