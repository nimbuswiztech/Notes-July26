# docker real time scenarios

## Docker Real-Time Scenarios: Comprehensive Teaching Guide

## Docker Images vs Containers: The Foundation

### Core Concept

Understanding the difference between Docker images and containers is fundamental to mastering containerization. A **Docker image** serves as a read-only template containing application code, runtime, libraries, and dependencies, while a **Docker container** is a running instance of that image.

### Real-World Analogy: Cookie Cutter vs Cookies

The best way to understand this concept is through the cookie cutter analogy:

* **Image = Cookie Cutter** (template/blueprint)
* **Container = Actual Cookie** (running instance)
* You can make multiple cookies from one cutter
* Each cookie is independent
* The cutter remains unchanged regardless of how many cookies you make

## Real-Time Dockerfile Examples

### Scenario 1: Multi-Stage Node.js E-commerce Application

This example demonstrates a production-ready Node.js application with security best practices:

```dockerfile
# Multi-stage Node.js Web Application Dockerfile
FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
```

**Key Features:**

* Multi-stage build for smaller production images
* Non-root user for enhanced security
* Health check for container monitoring
* Optimized dependency installation

### Scenario 2: Java Spring Boot Banking API

```dockerfile
FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apt-get update && apt-get install -y maven
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim AS production
RUN addgroup --system spring && adduser --system spring --ingroup spring
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar
USER spring:spring
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## Docker Compose for Microservices Architecture

### Complete E-commerce Platform Example

This demonstrates a real-world microservices setup with proper service dependencies and health checks:

```yaml
version: '3.8'

services:
  # Database Service
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: securepassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Redis Cache
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # Backend API Service
  api:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://appuser:securepassword@postgres:5432/appdb
      REDIS_URL: redis://redis:6379
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

**Key Features:**

* Service dependencies with health checks
* Custom networks for secure service communication
* Persistent data storage with volumes
* Proper startup sequencing

## Debugging and Troubleshooting Scenarios

### Essential Debugging Commands

#### Container Log Analysis

```bash
# Check container logs
docker logs container_name
docker logs -f container_name  # Follow logs in real-time
docker logs --tail 50 container_name  # Last 50 lines

# Inspect container details
docker inspect container_name
docker inspect container_name | grep -i health
docker inspect container_name | grep -i status
```

#### Interactive Debugging

```bash
# Execute commands inside container
docker exec -it container_name /bin/bash
docker exec -it container_name /bin/sh
docker exec container_name ps aux  # Check running processes

# Check container resource usage
docker stats container_name
docker stats --no-stream  # Single snapshot
```

#### Network Troubleshooting

```bash
# Debug networking issues
docker network ls
docker network inspect network_name
docker exec container_name nslookup another_container
docker exec container_name ping container_name
```

### Health Check Implementation and Debugging

Health checks are crucial for production deployments. Here's how to implement and debug them:

#### Basic Health Check Implementation

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

#### Health Check Debugging Commands

```bash
# Manual health check execution
docker exec container_name curl -f http://localhost:8080/health

# Check health status
docker ps  # Shows health status in the output
docker inspect container_name --format='{{.State.Health.Status}}'

# View detailed health check logs
docker inspect container_name --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

### Common Issues and Solutions

#### Issue 1: Container Exits Immediately

* **Diagnosis:** Container's main process terminates
* **Solution:** Ensure the main process runs continuously
* **Debug command:** `docker logs container_name`

#### Issue 2: Port Binding Failures

* **Diagnosis:** Port already in use by another service
* **Solution:** Use different port or stop conflicting service
* **Debug command:** `netstat -tulpn | grep :8080`

#### Issue 3: Network Connectivity Issues

* **Diagnosis:** Containers cannot communicate
* **Solution:** Ensure containers are on the same network
* **Debug command:** `docker exec app_container ping db_container`

#### Issue 4: Resource Exhaustion

* **Diagnosis:** Out of disk space or memory
* **Solution:** Clean up unused resources and set resource limits
* **Debug commands:**

```bash
docker system df
docker system prune -a
```

#### Issue 5: Permission Denied Errors

* **Diagnosis:** Incorrect file permissions or user context
* **Solution:** Fix ownership or run as correct user
* **Debug command:** `docker exec container_name ls -la /app`

## Production Security Best Practices

### Security Hardening Techniques

#### 1. Use Non-Root Users

```dockerfile
RUN adduser --disabled-password --gecos '' appuser
USER appuser
```

#### 2. Implement Resource Limits

```bash
docker run --memory=1g --cpus=2 my-app
```

#### 3. Use Read-Only Filesystems

```bash
docker run --read-only --tmpfs /tmp my-app
```

#### 4. Regular Security Scanning

* Scan base images for vulnerabilities
* Use trusted registries
* Implement Docker Content Trust

#### 5. Secret Management

* Never hardcode secrets in Dockerfiles
* Use dedicated secret management tools
* Set proper file permissions

## Performance Optimization Strategies

### Multi-Stage Builds

Reduce image size by separating build and runtime environments:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
CMD ["node", "dist/server.js"]
```

### Container Monitoring

Implement comprehensive monitoring for production environments:

```bash
# Real-time resource monitoring
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Container health monitoring
docker inspect --format='{{.State.Health.Status}}' $(docker ps -q)
```

## Hands-On Demonstration Steps

{% stepper %}
{% step %}
### Images vs Containers Demo

```bash
# Demonstrate the concept
docker pull nginx:alpine
docker images
docker run -d --name demo1 -p 8080:80 nginx:alpine
docker run -d --name demo2 -p 8081:80 nginx:alpine
docker ps
# Show same image, different containers
```
{% endstep %}

{% step %}
### Real Application Build

1. Create a simple Node.js application
2. Write a production-ready Dockerfile
3. Build and run the container
4. Demonstrate debugging techniques
5. Show health check implementation
{% endstep %}

{% step %}
### Microservices Demo

1. Use Docker Compose to show service communication
2. Demonstrate health checks and dependencies
3. Show scaling and load balancing
4. Implement service discovery
{% endstep %}

{% step %}
### Troubleshooting Session

1. Intentionally introduce common issues
2. Show systematic debugging process
3. Fix issues step by step
4. Demonstrate monitoring and logging
{% endstep %}
{% endstepper %}

This comprehensive guide provides real-time scenarios that will help your students understand Docker concepts through practical examples, covering everything from basic image-container differences to advanced production deployment strategies with proper debugging and security practices.
