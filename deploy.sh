#!/bin/bash
# ==============================================
# Trustbit Advance Search - Production Deployer
# Run this ON the production server
# Usage: bash deploy.sh
# ==============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Trustbit Advance Search - Deploy ===${NC}"

# Auto-detect bench path
BENCH_PATH=""
for path in /home/frappe/frappe-bench /home/$USER/frappe-bench /opt/bench/frappe-bench; do
  if [ -f "$path/Procfile" ]; then
    BENCH_PATH="$path"
    break
  fi
done

if [ -z "$BENCH_PATH" ]; then
  echo -e "${RED}ERROR: Could not find bench directory!${NC}"
  echo "Please set BENCH_PATH manually: BENCH_PATH=/your/path bash deploy.sh"
  exit 1
fi

SITE=$(cat "$BENCH_PATH/sites/currentsite.txt" 2>/dev/null || echo "")
if [ -z "$SITE" ]; then
  echo -e "${RED}ERROR: No default site found!${NC}"
  exit 1
fi

echo -e "Bench: ${GREEN}$BENCH_PATH${NC}"
echo -e "Site:  ${GREEN}$SITE${NC}"
echo ""

# Step 1: Backup
echo -e "${YELLOW}[1/5] Taking backup...${NC}"
cd "$BENCH_PATH"
bench --site "$SITE" backup
echo -e "${GREEN}Backup done.${NC}"

# Step 2: Pull code
echo -e "${YELLOW}[2/5] Pulling latest code from GitHub...${NC}"
cd "$BENCH_PATH/apps/trustbit_advance_search"
git stash 2>/dev/null || true
git pull origin main
echo -e "${GREEN}Code updated.${NC}"

# Step 3: Build
echo -e "${YELLOW}[3/5] Building assets...${NC}"
cd "$BENCH_PATH"
bench build --app trustbit_advance_search
echo -e "${GREEN}Assets built.${NC}"

# Step 4: Clear cache
echo -e "${YELLOW}[4/5] Clearing cache...${NC}"
bench --site "$SITE" clear-cache
echo -e "${GREEN}Cache cleared.${NC}"

# Step 5: Restart
echo -e "${YELLOW}[5/5] Restarting services...${NC}"
sudo supervisorctl restart all 2>/dev/null || bench restart
echo -e "${GREEN}Services restarted.${NC}"

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "Verify at: https://kgs.trustbit.cloud"
