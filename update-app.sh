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

# Fix favicon MIME type issue
echo -e "${YELLOW}Fixing favicon MIME type issue...${NC}"
if [ -f "assets/images/icon.png" ]; then
    cp assets/images/icon.png assets/images/favicon.ico
    echo "Favicon created from icon.png"
else
    echo "Creating simple favicon..."
    # Create a minimal favicon.ico file
    printf '\x00\x00\x01\x00\x01\x00\x10\x10\x00\x00\x01\x00\x20\x00\x68\x04\x00\x00\x16\x00\x00\x00' > assets/images/favicon.ico
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
# Set environment variables for production build
export NODE_ENV=production
export EXPO_PUBLIC_CONVEX_URL=$CONVEX_URL
npx expo export --platform web --clear

# Restart PM2 process
echo -e "${YELLOW}Restarting application...${NC}"
pm2 restart expo-app

# Reload nginx
echo -e "${YELLOW}Reloading nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}Update completed successfully!${NC}"
echo -e "${GREEN}Application is running at: http://your-domain.com${NC}"
