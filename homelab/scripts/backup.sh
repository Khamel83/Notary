#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Notary Database Backup ===${NC}"

# Source environment variables
set -a
source .env
set +a

# Backup configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/notary_backup_$TIMESTAMP.sql"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}[*] Creating database backup...${NC}"

# Create backup using pg_dump
docker-compose exec -T postgres pg_dump \
    -U "$DB_USER" \
    -d notary \
    --no-password \
    --verbose \
    --clean \
    --if-exists \
    --format=custom \
    --file="/tmp/backup_$TIMESTAMP.dump"

# Copy backup from container to host
docker cp "notary-postgres:/tmp/backup_$TIMESTAMP.dump" "$BACKUP_DIR/"

# Also create a SQL backup for easy restoration
docker-compose exec -T postgres pg_dump \
    -U "$DB_USER" \
    -d notary \
    --no-password \
    --verbose \
    --clean \
    --if-exists \
    --format=plain \
    > "$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_FILE"

echo -e "${GREEN}✅ Backup created: ${BACKUP_FILE}.gz${NC}"

# Clean up old backups
echo -e "${GREEN}[*] Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "notary_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "backup_*.dump" -mtime +$RETENTION_DAYS -delete

# List remaining backups
echo -e "${GREEN}[*] Current backups:${NC}"
ls -lah "$BACKUP_DIR"/notary_backup_*.sql.gz || echo "No SQL backups found"
ls -lah "$BACKUP_DIR"/backup_*.dump || echo "No dump backups found"

echo -e "${GREEN}✅ Backup process complete${NC}"