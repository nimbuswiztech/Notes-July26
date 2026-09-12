# cmd and entrypoint

## CMD and ENTRYPOINT

### CMD (Command) concept

**What is CMD?**

CMD stands for "command" and generally refers to an instruction or directive given to a computer program or system to perform a specific task.

**Real-time scenario**

Imagine you are using a smartphone or computer. When you want to open an application, you tap or click its icon—this action is like giving a command to the device to “start this program.” Similarly, in programming or operating systems, commands are instructions that tell the computer what to do.

In a programming context, a CMD could be a command-line instruction such as:

* `copy file1.txt file2.txt` — copies a file from one name to another.
* `start app.exe` — tells the system to launch an application.

### Entry Point concept

**What is an entry point?**

The entry point is where a program begins execution. It is like the front door of a building—when you enter, you start your journey inside. Similarly, a program has one designated starting place from which it begins running its code.

**Real-time scenario**

Think of watching a movie. The entry point is like the start button on your streaming service. Without pressing “play,” the movie does not begin. When you press “play,” the movie starts from the very first scene.

## CMD and ENTRYPOINT in Docker

### CMD

* **Concept:** CMD specifies the default command that runs when a container starts from a Docker image. It is a default instruction that runs unless the user overrides it at runtime.
* **Real-time analogy:** Imagine a coffee machine where the default button brews an espresso. If you press the default button without specifying anything else, it makes an espresso. You can override this default and ask the machine to make a cappuccino instead.
* **In Docker:** CMD sets default commands or parameters for the container, but these can be overridden by specifying another command during `docker run`.

### ENTRYPOINT

* **Concept:** ENTRYPOINT defines the main executable that always runs when the container starts. It establishes the container’s primary purpose. Arguments passed at runtime are appended to the ENTRYPOINT command.
* **Real-time analogy:** ENTRYPOINT is like the engine of a car that always runs when you start the car. You can control parameters such as speed or radio volume, but the engine always starts.
* **In Docker:** ENTRYPOINT ensures a container runs a specific executable or script regardless of commands passed at runtime, unless ENTRYPOINT itself is explicitly overridden.

### Correlation between CMD and ENTRYPOINT

* ENTRYPOINT sets the executable.
* CMD provides default arguments to ENTRYPOINT.
* Arguments provided in `docker run` override CMD but are appended to ENTRYPOINT.
* If ENTRYPOINT is not set, CMD acts as the command to run.

### Sample Dockerfiles

#### Example 1: CMD only

```dockerfile
FROM ubuntu
CMD ["echo", "Hello from CMD"]
```

This image executes `echo "Hello from CMD"` by default.

Override it at runtime:

```bash
docker run <image> echo "Overriding CMD"
```

This prints `Overriding CMD`.

#### Example 2: ENTRYPOINT only

```dockerfile
FROM alpine
ENTRYPOINT ["ls"]
```

The container runs `ls` by default.

Pass arguments to `ls`:

```bash
docker run <image> -alh
```

This runs `ls -alh`.

#### Example 3: ENTRYPOINT and CMD together

```dockerfile
FROM ubuntu
ENTRYPOINT ["echo"]
CMD ["Hello from ENTRYPOINT and CMD"]
```

By default, this runs:

```bash
echo "Hello from ENTRYPOINT and CMD"
```

Override CMD while keeping ENTRYPOINT fixed:

```bash
docker run <image> "Override argument"
```

This runs:

```bash
echo "Override argument"
```

## Docker build arguments

Build arguments are variables passed at **build time** to parameterize a Dockerfile.

* Unlike environment variables (`ENV`), they are available only during the image build process and are not accessible after the image is built.
* They are useful for configurable values such as versions or proxy URLs during the Docker build stage.

### Using build arguments in a Dockerfile

```dockerfile
ARG APP_VERSION=1.0
FROM ubuntu

RUN echo "Building version $APP_VERSION"

ENTRYPOINT ["echo"]
CMD ["Default message"]
```

Build the image:

```bash
docker build --build-arg APP_VERSION=2.0 -t myapp:latest .
```

This sets the build-time variable `APP_VERSION` to `2.0`.

The `RUN` command uses this version during the build. CMD and ENTRYPOINT still control what the container runs at runtime.

### Summary for students

| Term       | Purpose                                | Runtime override                  | Real-life analogy                        |
| ---------- | -------------------------------------- | --------------------------------- | ---------------------------------------- |
| CMD        | Default command or arguments to run    | Can be overridden easily          | Default coffee button on a machine       |
| ENTRYPOINT | Defines the fixed executable to run    | Hard to override; requires a flag | Car engine that always runs              |
| Build Arg  | Variables for build-time configuration | Not accessible at runtime         | Recipe ingredients chosen before cooking |

## How CMD, ENTRYPOINT, and build arguments work together in Docker

Understanding how Docker's CMD, ENTRYPOINT, and build arguments (`ARG`) work together is essential for creating flexible and maintainable container images. These components operate at different phases and serve complementary purposes in controlling container execution.

### Build-time and runtime components

#### Build-time: ARG

* Build arguments are variables that exist only during the image build process.
* They are passed using the `--build-arg` flag during `docker build`.
* They are not available in the final running container unless converted to environment variables.
* They are used to customize the build process without modifying the Dockerfile.

#### Runtime: CMD and ENTRYPOINT

* CMD provides default command or arguments that can be overridden easily.
* ENTRYPOINT sets a fixed executable that always runs.
* Both control what happens when a container starts from the built image.

### Interaction flow

#### 1. Build arguments: build-time configuration

Build arguments allow you to parameterize a Dockerfile without hardcoding values. They work exclusively during the build process:

```dockerfile
ARG VERSION=1.0.0
ARG ENVIRONMENT=production

# Use during build
RUN echo "Building version $VERSION for $ENVIRONMENT"

# Convert to runtime ENV if needed
ENV APP_VERSION=$VERSION
ENV APP_ENV=$ENVIRONMENT
```

**Key characteristics of ARG:**

* Available only during the build process.
* Can be overridden with the `--build-arg` flag.
* Not persisted in the final image unless converted to `ENV`.
* Useful for conditional logic during builds.

#### 2. ENTRYPOINT: the fixed executable

ENTRYPOINT defines the main command that always executes when the container starts. It creates containers that behave like executables:

```dockerfile
ENTRYPOINT ["python", "app.py"]
```

**ENTRYPOINT behavior:**

* Always runs and is difficult to override; it requires the `--entrypoint` flag.
* Arguments from `docker run` are appended to ENTRYPOINT.
* Best for setting the main application or tool.

#### 3. CMD: default arguments and flexibility

CMD provides default arguments that can be easily overridden. Its purpose depends on whether ENTRYPOINT is present:

```dockerfile
# Without ENTRYPOINT: CMD is the main command
CMD ["python", "app.py"]

# With ENTRYPOINT: CMD provides default arguments
ENTRYPOINT ["python"]
CMD ["app.py"]
```

### Combination matrix

| Dockerfile setup                        | `docker run image` | `docker run image arg1` | Final executed command     |
| --------------------------------------- | ------------------ | ----------------------- | -------------------------- |
| `CMD ["echo", "hello"]`                 | ✓                  | ✓                       | `echo hello` / `arg1`      |
| `ENTRYPOINT ["echo"]`                   | ✓                  | ✓                       | `echo` / `echo arg1`       |
| `ENTRYPOINT ["echo"]` + `CMD ["hello"]` | ✓                  | ✓                       | `echo hello` / `echo arg1` |

### Real-world integration example

The following example shows how all three work together in a Python web application:

```dockerfile
# Build arguments for flexibility
ARG PYTHON_VERSION=3.11
ARG ENVIRONMENT=production
ARG APP_PORT=8000

# Use ARG in FROM instruction
FROM python:${PYTHON_VERSION}-slim

# Convert build args to runtime environment variables
ENV ENVIRONMENT=$ENVIRONMENT
ENV APP_PORT=$APP_PORT

# Conditional installation based on build arg
RUN if [ "$ENVIRONMENT" = "development" ]; then \
        pip install debugpy pytest; \
    fi

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# ENTRYPOINT ensures Python always runs
ENTRYPOINT ["python"]

# CMD provides default script and arguments
CMD ["app.py", "--port", "$APP_PORT"]
```

**Usage examples:**

```bash
# Build for production (default)
docker build -t myapp .

# Build for development with debugging tools
docker build -t myapp-dev --build-arg ENVIRONMENT=development .

# Build with different Python version
docker build -t myapp --build-arg PYTHON_VERSION=3.12 .

# Run with defaults: python app.py --port 8000
docker run -p 8000:8000 myapp

# Run different script: python manage.py migrate
docker run myapp manage.py migrate

# Run shell: python -c "import sys; print(sys.version)"
docker run -it myapp -c "import sys; print(sys.version)"
```

### Best practices

#### Use the ENTRYPOINT and CMD pattern

A recommended approach is to combine ENTRYPOINT for the main executable and CMD for default arguments:

```dockerfile
ENTRYPOINT ["./myapp"]
CMD ["--config=default", "--verbose"]
```

This allows users to:

* Override defaults: `docker run image --config=custom`
* Keep the main executable fixed.
* Maintain predictable behavior.

#### Bridge build time to runtime

Convert important build arguments to environment variables when runtime access is needed:

```dockerfile
ARG DATABASE_URL=postgres://localhost:5432/app
ARG DEBUG=false

ENV DATABASE_URL=$DATABASE_URL
ENV DEBUG=$DEBUG

ENTRYPOINT ["./start.sh"]
CMD ["server"]
```

#### Implement conditional build logic

Use build arguments to customize the build process:

```dockerfile
ARG BUILD_TYPE=release

RUN if [ "$BUILD_TYPE" = "debug" ]; then \
        make debug && cp debug/app /usr/local/bin/; \
    else \
        make release && cp release/app /usr/local/bin/; \
    fi

ENTRYPOINT ["/usr/local/bin/app"]
CMD ["--help"]
```

### Advanced integration patterns

#### Multi-stage builds with shared arguments

```dockerfile
ARG NODE_VERSION=18
ARG BUILD_ENV=production

# Build stage
FROM node:${NODE_VERSION} AS builder
ARG BUILD_ENV
WORKDIR /app
COPY package*.json ./
RUN if [ "$BUILD_ENV" = "development" ]; then \
        npm install; \
    else \
        npm ci --only=production; \
    fi
COPY . .
RUN npm run build

# Runtime stage
FROM node:${NODE_VERSION}-alpine
ARG BUILD_ENV
ENV NODE_ENV=$BUILD_ENV
COPY --from=builder /app/dist ./
ENTRYPOINT ["node"]
CMD ["index.js"]
```

#### Dynamic entry point scripts

Create flexible entry points that use both build-time and runtime configuration:

```dockerfile
ARG SERVICE_NAME=webapp
ENV SERVICE_NAME=$SERVICE_NAME

# Create dynamic entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'echo "Starting $SERVICE_NAME in $NODE_ENV mode"' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start"]
```

### Troubleshooting integration issues

#### Build arguments are not available at runtime

**Issue:** ARG values disappear in running containers.

**Solution:** Convert them to environment variables.

```dockerfile
# Wrong - ARG not available at runtime
ARG VERSION=1.0
CMD ["sh", "-c", "echo Version: $VERSION"]

# Correct - Convert to ENV
ARG VERSION=1.0
ENV VERSION=$VERSION
CMD ["sh", "-c", "echo Version: $VERSION"]
```

#### Cannot override container behavior

**Issue:** Users cannot customize container execution.

**Solution:** Use the ENTRYPOINT and CMD pattern instead of CMD alone.

```dockerfile
# Less flexible
CMD ["./app", "--config=prod", "--verbose"]

# More flexible
ENTRYPOINT ["./app"]
CMD ["--config=prod", "--verbose"]
```

### Conclusion

The combination of ARG, ENTRYPOINT, and CMD creates a powerful system for container execution control:

* **ARG** provides build-time flexibility without changing Dockerfiles.
* **ENTRYPOINT** ensures a consistent main executable.
* **CMD** offers sensible defaults that users can easily override.

Understanding their interaction enables you to build images that are both opinionated through ENTRYPOINT and flexible through CMD, while build arguments allow customization at build time.
