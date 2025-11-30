#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Usage: $0 <backup_file>${NC}"
    echo -e "${YELLOW}   Available backups:${NC}"
    ls -lah ./backups/notary_backup_*.sql.gz 2>/dev/null || echo "No SQL backups found"
    ls -lah ./backups/backup_*.dump 2>/dev/null || echo "No dump backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Source environment variables
set -a
source .env
set +a

echo -e "${GREEN}=== Notary Database Restore ===${NC}"
echo -e "${YELLOW}⚠️  This will REPLACE all current data in the database${NC}"
echo -e "${YELLOW}   Are you sure you want to continue? (y/N)${NC}"
read -r confirmation

if [ "$confirmation" != "y" ] && [ "$confirmation" != "Y" ]; then
    echo -e "${YELLOW}❌ Restore cancelled${NC}"
    exit 0
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}[*] Restoring from backup: $BACKUP_FILE${NC}"

# Handle different backup formats
if [[ "$BACKUP_FILE" == *.gz ]]; then
    # SQL GZIP backup
    echo -e "${GREEN}[*] Extracting and restoring SQL backup...${NC}"

    # Copy to container and restore
    docker cp "$BACKUP_FILE" "notary-postgres:/tmp/restore.sql.gz"
    docker-compose exec -T postgres bash -c "
        gunzip -c /tmp/restore.sql.gz | psql -U '$DB_USER' -d notary
        rm /tmp/restore.sql.gz
    "

elif [[ "$BACKUP_FILE" == *.dump ]]; then
    # Custom format backup
    echo -e "${GREEN}[*] Restoring custom format backup...${NC}"

    # Copy to container and restore
    docker cp "$BACKUP_FILE" "notary-postgres:/tmp/restore.dump"
    docker-compose exec -T postgres bash -c "
        pg_restore -U '$DB_USER' -d notary --clean --if-exists --verbose /tmp/restore.dump
        rm /tmp/restore.dump
    "
else
    echo -e "${RED}❌ Unsupported backup format. Use .sql.gz or .dump files${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database restore complete!${NC}"

# Verify restore
echo -e "${GREEN}[*] Verifying restore...${NC}"
RECORD_COUNT=$(docker-compose exec -T postgres psql -U "$DB_USER" -d notary -t -c "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | tr -d ' \n' || echo "0")

if [ "$RECORD_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Restore verified - found $RECORD_COUNT user records${NC}"
else
    echo -e "${YELLOW}⚠️  Restore completed but no user records found (might be expected)${NC}"
fi

echo -e "${GREEN}=== Restore Complete ===${NC}"