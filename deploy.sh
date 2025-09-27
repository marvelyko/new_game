#!/bin/bash

# DigitalOcean Droplet Deployment Script for Expo App
# Run this script on your DigitalOcean droplet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment of Expo app...${NC}"

# Update system packages
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo -e "${YELLOW}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo -e "${YELLOW}Installing PM2...${NC}"
sudo npm install -g pm2

# Install nginx
echo -e "${YELLOW}Installing nginx...${NC}"
sudo apt install -y nginx

# Create application directory
echo -e "${YELLOW}Setting up application directory...${NC}"
sudo mkdir -p /var/www/expo-app
sudo chown -R $USER:$USER /var/www/expo-app

# Install application dependencies
echo -e "${YELLOW}Installing application dependencies...${NC}"
cd /var/www/expo-app
npm install

# Install Expo CLI globally
echo -e "${YELLOW}Installing Expo CLI...${NC}"
sudo npm install -g @expo/cli

# Build the application for production
echo -e "${YELLOW}Building application for production...${NC}"
npx expo export --platform web

# Set up PM2
echo -e "${YELLOW}Configuring PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure nginx
echo -e "${YELLOW}Configuring nginx...${NC}"
sudo cp nginx.conf /etc/nginx/sites-available/expo-app
sudo ln -sf /etc/nginx/sites-available/expo-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo -e "${YELLOW}Testing nginx configuration...${NC}"
sudo nginx -t

# Start nginx
echo -e "${YELLOW}Starting nginx...${NC}"
sudo systemctl enable nginx
sudo systemctl restart nginx

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Create log directories
echo -e "${YELLOW}Setting up log directories...${NC}"
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update your domain name in /etc/nginx/sites-available/expo-app"
echo "2. Obtain SSL certificates (recommended: use Let's Encrypt)"
echo "3. Configure your Convex backend environment variables"
echo "4. Test your application at http://your-domain.com"

# Show status
echo -e "${GREEN}Current status:${NC}"
pm2 status
sudo systemctl status nginx --no-pager
