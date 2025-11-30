#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Notary Homelab Database Setup ===${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit .env file with your secure password and configuration.${NC}"
    echo -e "${YELLOW}   Run this script again after editing .env${NC}"
    exit 1
fi

# Source environment variables
set -a
source .env
set +a

# Validate required variables
if [ "$DB_PASSWORD" = "your_secure_password_here_change_this" ]; then
    echo -e "${RED}❌ Please edit .env file and change the default password${NC}"
    exit 1
fi

echo -e "${GREEN}[*] Starting database services...${NC}"

# Stop any existing containers
docker-compose down --remove-orphans || true

# Start the services
docker-compose up -d

echo -e "${GREEN}[*] Waiting for database to be ready...${NC}"

# Wait for database to be healthy
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U "$DB_USER" -d notary; then
        echo -e "${GREEN}✅ Database is ready!${NC}"
        break
    fi

    attempt=$((attempt + 1))
    echo -e "${YELLOW}⏳ Waiting for database... (attempt $attempt/$max_attempts)${NC}"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ Database failed to start${NC}"
    docker-compose logs postgres
    exit 1
fi

# Check PgBouncer
if docker-compose exec -T pgbouncer pg_isready -h localhost -p 6432 -U "$DB_USER"; then
    echo -e "${GREEN}✅ PgBouncer is ready!${NC}"
else
    echo -e "${RED}❌ PgBouncer failed to start${NC}"
    docker-compose logs pgbouncer
    exit 1
fi

# Show connection information
echo -e "${GREEN}=== Database Connection Information ===${NC}"
echo -e "${GREEN}📍 Local PostgreSQL:${NC}"
echo -e "   Host: localhost"
echo -e "   Port: $DB_PORT"
echo -e "   Database: notary"
echo -e "   User: $DB_USER"
echo ""
echo -e "${GREEN}📍 PgBouncer (Recommended for production):${NC}"
echo -e "   Host: localhost"
echo -e "   Port: $PGBOUNCER_PORT"
echo -e "   Database: notary"
echo -e "   User: $DB_USER"
echo ""
echo -e "${YELLOW}💡 For Vercel deployment, update your DATABASE_URL to:${NC}"
echo -e "   postgresql://$DB_USER:$DB_PASSWORD@YOUR_EXTERNAL_HOST:$PGBOUNCER_PORT/notary?pgbouncer=true"
echo ""

# Test database connection
echo -e "${GREEN}[*] Testing database connection...${NC}"
docker-compose exec -T postgres psql -U "$DB_USER" -d notary -c "SELECT version();" > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection test successful!${NC}"
else
    echo -e "${RED}❌ Database connection test failed${NC}"
    exit 1
fi

# Create backup directory
mkdir -p backups

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${GREEN}✅ Database is running and ready for migration${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Run database migrations: npx prisma db push"
echo -e "   2. Set up external access (Tailscale recommended)"
echo -e "   3. Update Vercel environment variables"
echo -e "   4. Deploy to Vercel"