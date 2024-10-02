#!/bin/bash

# Navigate to the application directory
cd ~/findtute-server || exit

# Pull latest changes from the repository
git pull origin master

# Install dependencies
npm install

# Delete existing migration files (adjust the path if necessary)
sudo rm -rf src/migrations/*.ts

# Generate and run migrations
npm run migration:generate
npm run migration:run

# Build the application
npm run build

# Restart the application using PM2
pm2 restart all
