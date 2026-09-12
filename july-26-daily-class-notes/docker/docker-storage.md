# docker storage

## Types of Docker Storage

Comparison of Docker Storage Types: Volume Mounts vs Bind Mounts vs tmpfs Mounts

### 1. Volume Mounts (Recommended for Production)

Volume mounts are **Docker-managed storage** stored in dedicated directories, typically `/var/lib/docker/volumes/` on Linux systems:

```bash
# Create named volume
docker volume create my-app-data

# Mount volume to container
docker run -v my-app-data:/app/data my-image
```

**Best for**: Production databases, application data, essential caches

### 2. Bind Mounts (Ideal for Development)

Bind mounts create **direct links** between host directories and containers:

```bash
# Mount current directory to container
docker run -v "$(pwd)":/app my-dev-image

# Mount specific host path
docker run -v /home/user/code:/app/src my-image
```

**Best for**: Development environments, configuration files, real-time code editing

### 3. tmpfs Mounts (For Temporary Data)

tmpfs mounts store data in **host system memory (RAM)**, providing ultra-fast access but no persistence:

```bash
# Create tmpfs mount
docker run --tmpfs /tmp my-image
docker run --mount type=tmpfs,dst=/app/cache my-image
```

**Best for**: Temporary files, sensitive data, high-performance caching

## Real-World Scenarios & Examples

### Scenario 1: Web Development Environment

**Problem**: Developer needs to edit code without rebuilding Docker images constantly

**Solution**: Bind mount for live code updates

```dockerfile
# Development Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

```bash
# Development with live reload
docker run -d \
  --name dev-server \
  -p 3000:3000 \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  my-dev-image

# Code changes reflect immediately without rebuilds
```

### Scenario 2: MySQL Database with Persistent Storage

**Problem**: Database data must survive container updates and restarts

**Solution**: Named volume for database files

```bash
# Create persistent volume for MySQL
docker volume create mysql-data

# Run MySQL with persistent storage
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=secure123 \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=userpass \
  -v mysql-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

**Testing persistence**:

```bash
# Create test data
docker exec mysql-db mysql -u root -psecure123 \
  -e "INSERT INTO myapp.users (name) VALUES ('John Doe');"

# Stop and remove container
docker stop mysql-db && docker rm mysql-db

# Start new container with same volume
docker run -d --name mysql-new -v mysql-data:/var/lib/mysql mysql:8.0

# Data still exists!
```

### Scenario 3: Multi-Container Application with Shared Storage

**Problem**: Multiple containers need access to shared configuration or content

**Solution**: Shared named volume

```yaml
# docker-compose.yml
version: '3.8'
services:
  web1:
    image: nginx:alpine
    volumes:
      - shared-content:/usr/share/nginx/html
    ports:
      - "8081:80"

  web2:
    image: nginx:alpine
    volumes:
      - shared-content:/usr/share/nginx/html
    ports:
      - "8082:80"

  content-manager:
    image: alpine
    volumes:
      - shared-content:/data
    command: sh -c "while true; do echo 'Updated: $(date)' > /data/index.html; sleep 60; done"

volumes:
  shared-content:
```

### Scenario 4: Log Aggregation System

**Problem**: Application logs need centralized collection and analysis

**Solution**: Volume for log persistence

```bash
# Create log volume
docker volume create app-logs

# Application container with log volume
docker run -d \
  --name my-app \
  -v app-logs:/var/log/app \
  my-application

# Log analysis container
docker run -d \
  --name log-analyzer \
  -v app-logs:/logs:ro \
  logstash:latest
```

## Complete Docker Compose Example

Here's a **production-ready multi-service application** demonstrating various volume types:

```yaml
# docker-compose.yml - Complete Blog Application
version: '3.8'

services:
  # Database with persistent storage
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass123
    volumes:
      - db-data:/var/lib/mysql              # Named volume for data
      - ./mysql-config:/etc/mysql/conf.d:ro # Bind mount for config
    restart: unless-stopped

  # WordPress application
  wordpress:
    image: wordpress:latest
    depends_on:
      - database
    environment:
      WORDPRESS_DB_HOST: database:3306
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp-content:/var/www/html/wp-content # Named volume for uploads
      - ./wp-themes:/var/www/html/wp-content/themes # Bind mount for themes
    restart: unless-stopped

  # Reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro # Bind mount for config
      - wp-content:/var/www/html/wp-content:ro # Shared content volume
      - ssl-certs:/etc/nginx/ssl              # Named volume for certificates
    depends_on:
      - wordpress
    restart: unless-stopped

  # Redis for caching (tmpfs for session data)
  redis:
    image: redis:alpine
    tmpfs:
      - /tmp/redis-data  # tmpfs for temporary session storage
    command: redis-server --save 20 1 --loglevel warning
    restart: unless-stopped

volumes:
  db-data:      # MySQL persistent data
  wp-content:   # WordPress uploads and content
  ssl-certs:    # SSL certificates
```

## Debugging and Troubleshooting

### Issue 1: Permission Denied Errors

**Symptoms**: Cannot write to mounted volume, "Permission denied" errors

**Debug Steps**:

```bash
# Check file ownership and permissions
ls -la /path/to/volume
docker exec -it container-name ls -la /mounted/path
docker exec -it container-name whoami
```

**Solutions**:

```bash
# Fix host directory permissions
sudo chown -R $USER:$USER /host/path
sudo chmod -R 755 /host/path

# Run container with proper user mapping
docker run --user $(id -u):$(id -g) -v volume:/path image

# Use init option for proper permission handling
docker run --init -v volume:/path image
```

### Issue 2: Data Not Persisting

**Symptoms**: Data disappears after container restart

**Debug Steps**:

```bash
# Verify volume is properly mounted
docker inspect container-name | grep -A 10 "Mounts"

# Check volume details
docker volume inspect volume-name

# List all volumes
docker volume ls
```

**Solutions**:

```bash
# Ensure correct volume mount syntax
docker run -v volume-name:/exact/data/path image

# For databases, use correct data directories:

# MySQL: /var/lib/mysql

# PostgreSQL: /var/lib/postgresql/data

# MongoDB: /data/db
```

### Issue 3: Bind Mount Path Problems

**Symptoms**: Empty directories, files not visible

**Debug Steps**:

```bash
# Verify host path exists
ls -la /host/path

# Check Docker Desktop file sharing (Windows/Mac)

# Docker Desktop > Settings > Resources > File Sharing

# Use absolute paths
pwd  # Get current directory
```

**Solutions**:

```bash
# Always use absolute paths for bind mounts
docker run -v /full/path/to/host:/container/path image

# Create host directory if needed
mkdir -p /path/to/host/directory
```

### Issue 4: Volume Space Issues

**Symptoms**: "No space left on device" errors

**Debug Steps**:

```bash
# Check volume space usage
docker system df -v

# Find large volumes
docker volume ls
du -sh /var/lib/docker/volumes/*
```

**Solutions**:

```bash
# Clean up unused volumes
docker volume prune

# Remove specific volume (ensure no containers use it)
docker volume rm volume-name

# Full system cleanup
docker system prune -a --volumes
```

## Essential Commands Reference

### Volume Management

```bash
# Create named volume
docker volume create my-volume

# List all volumes
docker volume ls

# Inspect volume details
docker volume inspect my-volume

# Remove volume (must not be in use)
docker volume rm my-volume

# Remove all unused volumes
docker volume prune
```

### Container Volume Operations

```bash
# Named volume mount
docker run -v volume-name:/container/path image

# Bind mount (development)
docker run -v /host/path:/container/path image

# Read-only mount
docker run -v volume-name:/path:ro image

# tmpfs mount
docker run --tmpfs /tmp image
docker run --mount type=tmpfs,dst=/tmp image

# Multiple volumes
docker run -v vol1:/path1 -v vol2:/path2 image
```

### Debugging Commands

```bash
# Check container mounts
docker inspect container-name | grep -A 20 "Mounts"

# View container logs
docker logs container-name

# Access container filesystem
docker exec -it container-name /bin/bash

# Check volume contents (Linux)
sudo ls -la /var/lib/docker/volumes/volume-name/_data
```

## Best Practices

1. **Use Named Volumes** for production data that must persist
2. **Use Bind Mounts** for development and configuration files
3. **Use tmpfs** for temporary, sensitive, or high-performance data
4. **Regular Backups** of critical volumes using `docker cp` or volume backup tools
5. **Proper Permissions** - match user IDs between host and container
6. **Clean Up** unused volumes regularly with `docker volume prune`
7. **Document** volume requirements in README and docker-compose files
8. **Security** - never mount sensitive host directories unless necessary
