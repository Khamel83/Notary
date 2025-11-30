#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Notary Migration: Railway → Homelab ===${NC}"

# Check if required tools are installed
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}❌ pg_dump is not installed. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Configuration
RAILWAY_DB_URL="${RAILWAY_DATABASE_URL:-}"
HOMELAB_DB_URL="${HOMELAB_DATABASE_URL:-}"
BACKUP_DIR="./backups"
MIGRATION_LOG="$BACKUP_DIR/migration.log"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to log migration steps
log_migration() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$MIGRATION_LOG"
    echo -e "$1"
}

# Prompt for database URLs if not provided
if [ -z "$RAILWAY_DB_URL" ]; then
    echo -e "${YELLOW}📝 Please enter your Railway database URL:${NC}"
    read -s RAILWAY_DB_URL
    echo
fi

if [ -z "$HOMELAB_DB_URL" ]; then
    echo -e "${YELLOW}📝 Please enter your homelab database URL:${NC}"
    read -s HOMELAB_DB_URL
    echo
fi

# Validate URLs
if [[ ! "$RAILWAY_DB_URL" =~ postgresql:// ]]; then
    echo -e "${RED}❌ Invalid Railway database URL. Must start with postgresql://${NC}"
    exit 1
fi

if [[ ! "$HOMELAB_DB_URL" =~ postgresql:// ]]; then
    echo -e "${RED}❌ Invalid homelab database URL. Must start with postgresql://${NC}"
    exit 1
fi

log_migration "${BLUE}Starting migration from Railway to Homelab${NC}"

# Step 1: Backup Railway database
echo -e "${GREEN}[1/4] Creating backup of Railway database...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RAILWAY_BACKUP="$BACKUP_DIR/railway_backup_$TIMESTAMP.sql"

pg_dump "$RAILWAY_DB_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --disable-triggers \
    --format=plain \
    > "$RAILWAY_BACKUP"

if [ $? -eq 0 ]; then
    log_migration "${GREEN}✅ Railway database backed up to: $RAILWAY_BACKUP${NC}"
else
    log_migration "${RED}❌ Failed to backup Railway database${NC}"
    exit 1
fi

# Compress the backup
gzip "$RAILWAY_BACKUP"
RAILWAY_BACKUP_GZ="$RAILWAY_BACKUP.gz"
log_migration "${GREEN}✅ Backup compressed: $RAILWAY_BACKUP_GZ${NC}"

# Step 2: Verify homelab database is accessible
echo -e "${GREEN}[2/4] Verifying homelab database connectivity...${NC}"

# Extract connection details from homelab URL
HOMELAB_HOST=$(echo "$HOMELAB_DB_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
HOMELAB_PORT=$(echo "$HOMELAB_DB_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
HOMELAB_DB=$(echo "$HOMELAB_DB_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

log_migration "${BLUE}Testing connection to $HOMELAB_HOST:$HOMELAB_PORT/$HOMELAB_DB${NC}"

# Test connection
if pg_isready -h "$HOMELAB_HOST" -p "$HOMELAB_PORT" -d "$HOMELAB_DB" -t 10; then
    log_migration "${GREEN}✅ Homelab database is accessible${NC}"
else
    log_migration "${RED}❌ Cannot connect to homelab database${NC}"
    log_migration "${YELLOW}💡 Make sure your homelab database is running and accessible${NC}"
    exit 1
fi

# Step 3: Run Prisma migrations on homelab
echo -e "${GREEN}[3/4] Setting up database schema on homelab...${NC}"

# Make sure we're in the project root
cd "$(dirname "$0")/.."

# Generate Prisma client
npx prisma generate

# Push schema to homelab database
DATABASE_URL="$HOMELAB_DB_URL" npx prisma db push

if [ $? -eq 0 ]; then
    log_migration "${GREEN}✅ Database schema applied to homelab${NC}"
else
    log_migration "${RED}❌ Failed to apply schema to homelab database${NC}"
    exit 1
fi

# Step 4: Migrate data
echo -e "${GREEN}[4/4] Migrating data to homelab database...${NC}"

# Decompress and restore data
gunzip -c "$RAILWAY_BACKUP_GZ" | psql "$HOMELAB_DB_URL"

if [ $? -eq 0 ]; then
    log_migration "${GREEN}✅ Data migration completed successfully${NC}"
else
    log_migration "${RED}❌ Data migration failed${NC}"
    log_migration "${YELLOW}⚠️  Check the backup file and try manual restore${NC}"
    exit 1
fi

# Step 5: Verify migration
echo -e "${GREEN}[5/5] Verifying migration...${NC}"

# Count records in key tables
RECORD_COUNTS=$(psql "$HOMELAB_DB_URL" -t -c "
    SELECT
        (SELECT COUNT(*) FROM \"User\") as users,
        (SELECT COUNT(*) FROM Appointment) as appointments,
        (SELECT COUNT(*) FROM PricingRule) as pricing_rules,
        (SELECT COUNT(*) FROM JournalEntry) as journal_entries;
" 2>/dev/null | tr -d ' \n' || echo "0,0,0,0")

USERS=$(echo "$RECORD_COUNTS" | cut -d',' -f1)
APPOINTMENTS=$(echo "$RECORD_COUNTS" | cut -d',' -f2)
PRICING_RULES=$(echo "$RECORD_COUNTS" | cut -d',' -f3)
JOURNAL_ENTRIES=$(echo "$RECORD_COUNTS" | cut -d',' -f4)

echo -e "${GREEN}📊 Migration Summary:${NC}"
echo -e "   Users: $USERS"
echo -e "   Appointments: $APPOINTMENTS"
echo -e "   Pricing Rules: $PRICING_RULES"
echo -e "   Journal Entries: $JOURNAL_ENTRIES"

if [ "$APPOINTMENTS" -gt 0 ]; then
    log_migration "${GREEN}✅ Migration appears successful (found appointment data)${NC}"
else
    log_migration "${YELLOW}⚠️  Migration completed but no appointments found${NC}"
fi

# Generate Prisma client with new database
DATABASE_URL="$HOMELAB_DB_URL" npx prisma generate

# Final cleanup
log_migration "${BLUE}Creating final backup of migrated database...${NC}"
./homelab/scripts/backup.sh

echo -e "${GREEN}=== Migration Complete ===${NC}"
echo -e "${GREEN}✅ Database successfully migrated from Railway to Homelab${NC}"
echo -e ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Update your .env.local with the new DATABASE_URL"
echo -e "   2. Test the application locally: npm run dev"
echo -e "   3. Deploy to Vercel with updated environment variables"
echo -e "   4. Monitor the application for any issues"
echo -e ""
echo -e "${BLUE}📋 Migration log saved to: $MIGRATION_LOG${NC}"
echo -e "${BLUE}💾 Original backup: $RAILWAY_BACKUP_GZ${NC}"