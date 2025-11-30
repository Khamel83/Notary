#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Migration Validation Script ===${NC}"

# Configuration
HOMELAB_DB_URL="${DATABASE_URL:-}"
VALIDATION_REPORT="./backups/validation_report.txt"

# Function to validate table structure
validate_table_structure() {
    local table_name="$1"
    echo -e "${BLUE}Validating table structure for: $table_name${NC}"

    # Check if table exists
    table_exists=$(psql "$HOMELAB_DB_URL" -t -c "
        SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = '$table_name'
        );
    " 2>/dev/null | tr -d ' \n')

    if [ "$table_exists" = "t" ]; then
        echo -e "${GREEN}✅ Table '$table_name' exists${NC}"

        # Get column count
        column_count=$(psql "$HOMELAB_DB_URL" -t -c "
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = '$table_name' AND table_schema = 'public';
        " 2>/dev/null | tr -d ' \n')

        echo -e "   Columns: $column_count"
        return 0
    else
        echo -e "${RED}❌ Table '$table_name' missing${NC}"
        return 1
    fi
}

# Function to validate data integrity
validate_data_integrity() {
    local table_name="$1"
    local critical_columns="$2"

    echo -e "${BLUE}Validating data integrity for: $table_name${NC}"

    # Check for NULL values in critical columns
    for column in $critical_columns; do
        null_count=$(psql "$HOMELAB_DB_URL" -t -c "
            SELECT COUNT(*) FROM $table_name WHERE $column IS NULL;
        " 2>/dev/null | tr -d ' \n')

        if [ "$null_count" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Found $null_count NULL values in $table_name.$column${NC}"
        else
            echo -e "${GREEN}✅ No NULL values in $table_name.$column${NC}"
        fi
    done

    # Check for orphaned records (if applicable)
    if [ "$table_name" = "Appointment" ]; then
        orphaned_count=$(psql "$HOMELAB_DB_URL" -t -c "
            SELECT COUNT(*) FROM Appointment a
            LEFT JOIN \"User\" u ON a.userId = u.id
            WHERE u.id IS NULL;
        " 2>/dev/null | tr -d ' \n')

        if [ "$orphaned_count" -gt 0 ]; then
            echo -e "${RED}❌ Found $orphaned_count orphaned appointments${NC}"
        else
            echo -e "${GREEN}✅ No orphaned appointments${NC}"
        fi
    fi
}

# Function to validate foreign key constraints
validate_foreign_keys() {
    echo -e "${BLUE}Validating foreign key constraints...${NC}"

    # Check specific foreign key relationships
    relationships=(
        "Appointment.userId User"
        "Document.appointmentId Appointment"
        "JournalEntry.appointmentId Appointment"
    )

    for rel in "${relationships[@]}"; do
        local table=$(echo "$rel" | cut -d' ' -f1)
        local column=$(echo "$rel" | cut -d'.' -f2)
        local ref_table=$(echo "$rel" | cut -d' ' -f2)

        invalid_count=$(psql "$HOMELAB_DB_URL" -t -c "
            SELECT COUNT(*) FROM $table t
            LEFT JOIN $ref_table r ON t.$column = r.id
            WHERE r.id IS NULL AND t.$column IS NOT NULL;
        " 2>/dev/null | tr -d ' \n')

        if [ "$invalid_count" -gt 0 ]; then
            echo -e "${RED}❌ $table.$column has $invalid_count invalid references to $ref_table${NC}"
        else
            echo -e "${GREEN}✅ $table.$column references are valid${NC}"
        fi
    done
}

# Function to run database statistics
generate_statistics() {
    echo -e "${BLUE}Generating database statistics...${NC}"

    stats=$(psql "$HOMELAB_DB_URL" -t -c "
        SELECT
            (SELECT COUNT(*) FROM \"User\") as users,
            (SELECT COUNT(*) FROM Appointment) as appointments,
            (SELECT COUNT(*) FROM Document) as documents,
            (SELECT COUNT(*) FROM JournalEntry) as journal_entries,
            (SELECT COUNT(*) FROM PricingRule) as pricing_rules,
            (SELECT COUNT(*) FROM BlockedDate) as blocked_dates,
            (SELECT COUNT(*) FROM NotaryAvailability) as availability;
    " 2>/dev/null | tr -d ' \n' || echo "0,0,0,0,0,0,0")

    echo -e "${GREEN}📊 Database Statistics:${NC}"
    echo -e "   Users: $(echo "$stats" | cut -d',' -f1)"
    echo -e "   Appointments: $(echo "$stats" | cut -d',' -f2)"
    echo -e "   Documents: $(echo "$stats" | cut -d',' -f3)"
    echo -e "   Journal Entries: $(echo "$stats" | cut -d',' -f4)"
    echo -e "   Pricing Rules: $(echo "$stats" | cut -d',' -f5)"
    echo -e "   Blocked Dates: $(echo "$stats" | cut -d',' -f6)"
    echo -e "   Availability Rules: $(echo "$stats" | cut -d',' -f7)"
}

# Main validation process
main() {
    # Check if database URL is provided
    if [ -z "$HOMELAB_DB_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL environment variable is required${NC}"
        echo -e "${YELLOW}Usage: DATABASE_URL=postgresql://... $0${NC}"
        exit 1
    fi

    # Create validation report
    mkdir -p "./backups"
    {
        echo "Migration Validation Report"
        echo "========================"
        echo "Date: $(date)"
        echo "Database: $(echo "$HOMELAB_DB_URL" | sed 's/.*@\([^/]*\).*/\1/')"
        echo ""
    } > "$VALIDATION_REPORT"

    echo -e "${BLUE}Starting validation of migrated database...${NC}"

    # 1. Validate critical tables exist
    echo -e "\n${YELLOW}[1/4] Table Structure Validation${NC}"
    critical_tables=(
        "User"
        "Appointment"
        "Document"
        "JournalEntry"
        "PricingRule"
        "NotaryAvailability"
        "BlockedDate"
    )

    structure_valid=true
    for table in "${critical_tables[@]}"; do
        if ! validate_table_structure "$table"; then
            structure_valid=false
        fi
        echo "" >> "$VALIDATION_REPORT"
    done

    # 2. Validate data integrity
    echo -e "\n${YELLOW}[2/4] Data Integrity Validation${NC}"
    echo -e "\nData Integrity Results:" >> "$VALIDATION_REPORT"

    # Validate key tables
    validate_data_integrity "User" "id email"
    validate_data_integrity "Appointment" "id userId appointmentDate"
    validate_data_integrity "Document" "id appointmentId fileName"

    # 3. Validate foreign key constraints
    echo -e "\n${YELLOW}[3/4] Foreign Key Validation${NC}"
    echo -e "\nForeign Key Results:" >> "$VALIDATION_REPORT"
    validate_foreign_keys

    # 4. Generate statistics
    echo -e "\n${YELLOW}[4/4] Statistics Generation${NC}"
    echo -e "\nDatabase Statistics:" >> "$VALIDATION_REPORT"
    generate_statistics

    # Summary
    echo -e "\n${GREEN}=== Validation Summary ===${NC}"

    if [ "$structure_valid" = true ]; then
        echo -e "${GREEN}✅ All critical tables are present${NC}"
        echo -e "${GREEN}✅ Database structure validation passed${NC}"
    else
        echo -e "${RED}❌ Some tables are missing - migration may be incomplete${NC}"
        echo -e "${RED}❌ Please check the migration log and re-run if necessary${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Validation complete. Report saved to: $VALIDATION_REPORT${NC}"

    # Next steps
    echo -e "\n${YELLOW}📝 Next Steps:${NC}"
    echo -e "1. Review the validation report for any issues"
    echo -e "2. Test the application with: npm run dev"
    echo -e "3. Verify data in the application UI"
    echo -e "4. Deploy to Vercel with updated environment variables"
}

# Run validation
main "$@"