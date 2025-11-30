#!/bin/bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Vercel Setup Script ===${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed.${NC}"
    echo -e "${YELLOW}Please install it with: npm i -g vercel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"

# Setup database
echo -e "${GREEN}[*] Setting up homelab database...${NC}"
cd homelab

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please edit homelab/.env with your database password${NC}"
    echo -e "${YELLOW}   Then run this script again${NC}"
    exit 1
fi

# Start the database
echo -e "${GREEN}[*] Starting PostgreSQL database...${NC}"
./scripts/setup.sh

echo -e "${GREEN}✅ Database is running!${NC}"

# Generate database schema
cd ..
echo -e "${GREEN}[*] Setting up database schema...${NC}"

# Get database URL for local development
DB_URL="postgresql://notary_user:$(grep DB_PASSWORD homelab/.env | cut -d'=' -f2)@localhost:5432/notary"

# Set local environment
export DATABASE_URL="$DB_URL"

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

echo -e "${GREEN}✅ Database schema created!${NC}"

# Setup Vercel project
echo -e "${GREEN}[*] Setting up Vercel project...${NC}"
vercel link --confirm

echo -e "${GREEN}✅ Project linked to Vercel${NC}"

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "1. Run the app locally: npm run dev"
echo -e "2. Test everything works"
echo -e "3. Deploy to Vercel: vercel --prod"
echo -e ""
echo -e "${YELLOW}🔗 Your local database is ready!${NC}"
echo -e "   Connect to: $DB_URL"