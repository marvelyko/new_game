#!/bin/bash

# Update script for your Expo app
# Run this script when you want to update your deployed app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Updating Expo app...${NC}"

# Navigate to app directory
cd /var/www/expo-app

# Pull latest changes (if using git)
# git pull origin main

# Install/update dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npx expo export --platform web

# Restart PM2 process
echo -e "${YELLOW}Restarting application...${NC}"
pm2 restart expo-app

# Reload nginx
echo -e "${YELLOW}Reloading nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}Update completed successfully!${NC}"
echo -e "${GREEN}Application is running at: http://your-domain.com${NC}"
