#!/bin/bash
set -euo pipefail

echo "=== Initializing Notary Database ==="

# Create extension for UUID generation
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable UUID generation
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create indexes for performance (these will be created by Prisma anyway)
    -- But we can add some optimized ones here

    -- Create read-only user for analytics (optional)
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notary_readonly') THEN
            CREATE ROLE notary_readonly WITH LOGIN PASSWORD 'readonly_password_here';
            GRANT CONNECT ON DATABASE $POSTGRES_DB TO notary_readonly;
            GRANT USAGE ON SCHEMA public TO notary_readonly;
            GRANT SELECT ON ALL TABLES IN SCHEMA public TO notary_readonly;
            ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO notary_readonly;
        END IF;
    END
    \$\$;

    -- Set up row-level security policies (optional, for multi-tenant)
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Example policy (customize as needed)
    -- CREATE POLICY "Users can view their own data" ON users
    --     FOR ALL USING (id = current_setting('app.current_user_id')::uuid);

    -- Log database initialization
    INSERT INTO pg_stat_statements_reset() DEFAULT VALUES;
EOSQL

echo "✅ Database initialization complete"