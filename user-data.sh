#!/bin/bash
exec > /var/log/smartmoney-deploy.log 2>&1

# Install Docker
apt-get update -y
apt-get install -y docker.io docker-compose-v2 git
systemctl start docker
systemctl enable docker

# Clone repo
cd /home/ubuntu
git clone -b main https://github.com/prashantlandge/Smartmoney-uae.git || exit 1
cd Smartmoney-uae

# Create .env file
cat > .env << 'ENVEOF'
DB_PASSWORD=smartmoney_prod_2024
ANTHROPIC_API_KEY=
WISE_API_KEY=
XE_API_KEY=
ENVEOF

# Build and start using docker compose v2
docker compose -f docker-compose.prod.yml up -d --build

# Set ownership
chown -R ubuntu:ubuntu /home/ubuntu/Smartmoney-uae

echo "=== SmartMoney UAE deployment complete ==="
