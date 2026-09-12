# dockerfile images and containers

I've created a comprehensive training guide that covers everything you requested about Docker images, containers, and Dockerfiles. Here are the key insights:

## Docker Images vs Containers — Key Differences

**Docker Images** are **read-only templates** that serve as blueprints for containers. They package application code, dependencies, libraries, and runtime into an immutable snapshot. Think of an image as a **recipe** — it contains all the instructions needed but doesn't actually cook the meal.

**Docker Containers** are **running instances** of images. They add a writable layer on top of the read-only image layers, allowing modifications during runtime. Containers are like the **actual meal** prepared from the recipe — they're the executable environment where your application runs.

## Understanding Docker Layers Architecture

Docker images use a **layered architecture** where each Dockerfile instruction creates a new layer. These layers are:

* **Immutable**: Once created, layers cannot be changed
* **Cacheable**: Docker reuses unchanged layers for faster builds
* **Shareable**: Multiple images can share identical layers, saving storage space
* **Stackable**: Layers combine using a union filesystem to create the final container environment

Each layer contains only the **filesystem changes** from the previous layer — additions, deletions, or modifications. This design enables efficient storage, faster deployments, and incremental updates.

## Complete Dockerfile Instructions Guide

I've provided detailed explanations and examples for all essential Dockerfile commands:

### Core Instructions

* **FROM**: Defines the base image
* **WORKDIR**: Sets working directory
* **COPY/ADD**: Copies files into the image
* **RUN**: Executes build-time commands
* **CMD/ENTRYPOINT**: Defines container startup behavior
* **EXPOSE**: Documents port usage
* **ENV/ARG**: Sets environment variables and build arguments

### Sample Dockerfiles Included

1. **Node.js Application**: Complete production-ready setup
2. **Python Flask Application**: With security best practices
3. **Multi-stage Build**: Optimized for minimal final image size

## Container Creation Procedures

### Three Methods for Container Creation

{% stepper %}
{% step %}
## Direct Run (Most Common)

```bash
docker run -d --name webserver -p 8080:80 nginx
```
{% endstep %}

{% step %}
## Create Then Start

```bash
docker create --name myapp -p 8080:80 nginx
docker start myapp
```
{% endstep %}

{% step %}
## Interactive Mode

```bash
docker run -it --name interactive ubuntu /bin/bash
```
{% endstep %}
{% endstepper %}

The key difference: `docker run` **creates and starts** a container in one step, while `docker create` only **prepares** the container without starting it.
