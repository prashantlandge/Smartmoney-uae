#!/bin/bash
exec > /var/log/smartmoney-deploy.log 2>&1

apt-get update -y
apt-get install -y ca-certificates curl gnupg git

# Install Docker from official repo
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl start docker
systemctl enable docker

# Clone repo
cd /home/ubuntu
git clone -b main https://github.com/prashantlandge/Smartmoney-uae.git
cd Smartmoney-uae

# Create .env
cat > .env << 'ENVEOF'
DB_PASSWORD=smartmoney_prod_2024
ANTHROPIC_API_KEY=
WISE_API_KEY=
XE_API_KEY=
ENVEOF

# Build and run
docker compose -f docker-compose.prod.yml up -d --build

chown -R ubuntu:ubuntu /home/ubuntu/Smartmoney-uae
echo "=== DEPLOYMENT COMPLETE ==="
