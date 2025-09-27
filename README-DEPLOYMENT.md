# DigitalOcean Deployment Guide

This guide will help you deploy your Expo React Native app on a DigitalOcean droplet behind nginx.

## Prerequisites

1. A DigitalOcean droplet (Ubuntu 20.04 or later recommended)
2. A domain name pointing to your droplet's IP address
3. Your Convex backend deployed and configured

## Quick Start

### 1. Upload Files to Your Droplet

Upload all the configuration files to your DigitalOcean droplet:

```bash
# On your local machine
scp -r . user@your-droplet-ip:/home/user/expo-app-files/
```

### 2. Run the Deployment Script

SSH into your droplet and run the deployment script:

```bash
# SSH into your droplet
ssh user@your-droplet-ip

# Navigate to the uploaded files
cd /home/user/expo-app-files

# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### 3. Configure Your Domain

1. Update the nginx configuration with your domain:
   ```bash
   sudo nano /etc/nginx/sites-available/expo-app
   ```
   
2. Replace `your-domain.com` with your actual domain name

3. Test and reload nginx:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 4. Set Up SSL (Recommended)

Install Certbot and get SSL certificates:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 5. Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp env.production.example /var/www/expo-app/.env.production
   ```

2. Edit the environment file with your Convex configuration:
   ```bash
   nano /var/www/expo-app/.env.production
   ```

3. Update the Convex URL and deployment details

## File Structure

- `deploy.sh` - Main deployment script
- `update-app.sh` - Script to update your app
- `ecosystem.config.js` - PM2 configuration
- `nginx.conf` - Nginx reverse proxy configuration
- `expo-app.service` - Systemd service file
- `env.production.example` - Environment variables template

## Updating Your App

When you make changes to your app:

1. Upload the changes to your droplet
2. Run the update script:
   ```bash
   ./update-app.sh
   ```

## Monitoring

Check your app status:

```bash
# Check PM2 status
pm2 status

# Check nginx status
sudo systemctl status nginx

# View logs
pm2 logs expo-app
sudo journalctl -u nginx -f
```

## Troubleshooting

### Common Issues

1. **Port 3000 not accessible**: Check if PM2 is running and the port is open
2. **Nginx 502 error**: Verify the app is running on port 3000
3. **SSL issues**: Ensure your domain is properly configured and certificates are valid

### Useful Commands

```bash
# Restart PM2
pm2 restart expo-app

# Restart nginx
sudo systemctl restart nginx

# Check nginx configuration
sudo nginx -t

# View PM2 logs
pm2 logs expo-app --lines 100

# Check system resources
htop
df -h
```

## Security Considerations

1. Keep your system updated: `sudo apt update && sudo apt upgrade`
2. Configure firewall properly: `sudo ufw status`
3. Use strong passwords and SSH keys
4. Regularly backup your application data
5. Monitor logs for suspicious activity

## Performance Optimization

1. Enable gzip compression (already configured in nginx.conf)
2. Set up caching for static assets
3. Monitor memory usage with PM2
4. Consider using a CDN for static assets

## Support

If you encounter issues:

1. Check the logs: `pm2 logs expo-app`
2. Verify nginx configuration: `sudo nginx -t`
3. Check system resources: `htop` and `df -h`
4. Ensure all services are running: `sudo systemctl status nginx`
