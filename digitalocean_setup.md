# DigitalOcean Setup Guide for BizIntelTZ 24/7 Crawler

This guide provides detailed instructions for setting up the BizIntelTZ platform with 24/7 crawler functionality on a DigitalOcean Droplet.

## 1. Create a DigitalOcean Droplet

1. Log in to your DigitalOcean account
2. Click "Create" and select "Droplets"
3. Choose the following configuration:
   - **Distribution**: Ubuntu 22.04 LTS
   - **Plan**: Basic
   - **CPU options**: Regular with SSD (2GB RAM / 1 CPU minimum recommended)
   - **Datacenter region**: Choose one close to Tanzania (e.g., Bangalore or Frankfurt)
   - **Authentication**: SSH keys (recommended) or Password
   - **Hostname**: bizinteltz-production

## 2. Initial Server Setup

Connect to your server via SSH:

```bash
ssh root@your_server_ip
```

Update the system and install essential packages:

```bash
apt update && apt upgrade -y
apt install -y python3-pip python3-dev python3-venv nginx supervisor git
```

Create a non-root user for security:

```bash
adduser bizinteltz
usermod -aG sudo bizinteltz
```

## 3. Clone the Repository

Switch to the bizinteltz user:

```bash
su - bizinteltz
```

Clone the repository:

```bash
git clone https://github.com/yourusername/bizinteltz.git
cd bizinteltz
```

## 4. Set Up Python Environment

Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
pip install gunicorn
```

## 5. Configure the Application

Create a production .env file:

```bash
cp .env.example .env
nano .env
```

Update the environment variables as needed.

## 6. Set Up the Database

The application uses SQLite by default, which is already configured. For production, you might want to consider using a more robust database like PostgreSQL.

## 7. Configure Supervisor for 24/7 Operation

Create a supervisor configuration file:

```bash
sudo nano /etc/supervisor/conf.d/bizinteltz.conf
```

Add the following content:

```ini
[program:bizinteltz]
directory=/home/bizinteltz/bizinteltz
command=/home/bizinteltz/bizinteltz/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
user=bizinteltz
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/bizinteltz/bizinteltz.err.log
stdout_logfile=/var/log/bizinteltz/bizinteltz.out.log
```

Create log directories:

```bash
sudo mkdir -p /var/log/bizinteltz
sudo chown -R bizinteltz:bizinteltz /var/log/bizinteltz
```

Start the service:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bizinteltz
```

## 8. Configure Nginx as a Reverse Proxy

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/bizinteltz
```

Add the following content:

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/bizinteltz/bizinteltz/static/;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bizinteltz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 9. Set Up SSL with Let's Encrypt

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain and configure SSL certificate:

```bash
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

## 10. Monitoring the Crawler

### View Crawler Logs

```bash
sudo tail -f /var/log/bizinteltz/bizinteltz.out.log
```

### Check Crawler Status

You can check the crawler status through the web interface at `/admin/crawler` or via the API endpoint:

```bash
curl http://localhost:8000/api/crawler/status
```

### Restart the Crawler Service

If you need to restart the crawler:

```bash
sudo supervisorctl restart bizinteltz
```

## 11. Setting Up Automatic Updates

Create a deployment script:

```bash
nano /home/bizinteltz/deploy.sh
```

Add the following content:

```bash
#!/bin/bash
cd /home/bizinteltz/bizinteltz
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo supervisorctl restart bizinteltz
```

Make it executable:

```bash
chmod +x /home/bizinteltz/deploy.sh
```

## 12. Backup Configuration

Set up a cron job to backup the SQLite database:

```bash
crontab -e
```

Add the following line to run a backup daily at 2 AM:

```
0 2 * * * cp /home/bizinteltz/bizinteltz/bizinteltz.db /home/bizinteltz/backups/bizinteltz_$(date +\%Y\%m\%d).db
```

Make sure to create the backups directory:

```bash
mkdir -p /home/bizinteltz/backups
```

## 13. Security Considerations

1. Set up a firewall:

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. Configure fail2ban to prevent brute force attacks:

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 14. Monitoring and Maintenance

1. Set up basic monitoring with Netdata:

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

2. Schedule regular updates:

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Troubleshooting

### Crawler Not Running

Check the supervisor logs:

```bash
sudo supervisorctl status bizinteltz
sudo tail -f /var/log/bizinteltz/bizinteltz.err.log
```

### Database Issues

Check the database file permissions:

```bash
ls -la /home/bizinteltz/bizinteltz/bizinteltz.db
sudo chown bizinteltz:bizinteltz /home/bizinteltz/bizinteltz/bizinteltz.db
```

### Memory Issues

If the crawler is using too much memory, adjust the Gunicorn worker count in the supervisor configuration.