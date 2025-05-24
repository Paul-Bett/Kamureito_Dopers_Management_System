#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [dev|prod]"
    echo "  dev  - Deploy development environment"
    echo "  prod - Deploy production environment"
    exit 1
}

# Check if environment argument is provided
if [ $# -ne 1 ]; then
    usage
fi

ENV=$1

# Load environment variables
if [ "$ENV" = "dev" ]; then
    export $(cat .env.development | xargs)
    COMPOSE_FILE="docker-compose.override.yml"
elif [ "$ENV" = "prod" ]; then
    export $(cat .env.production | xargs)
    COMPOSE_FILE="docker-compose.prod.yml"
else
    usage
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Remove old volumes if needed
if [ "$ENV" = "dev" ]; then
    read -p "Do you want to remove all volumes? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f $COMPOSE_FILE down -v
    fi
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose -f $COMPOSE_FILE up --build -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run database migrations if needed
if [ "$ENV" = "dev" ]; then
    echo "Running database migrations..."
    docker-compose -f $COMPOSE_FILE exec backend alembic upgrade head
fi

echo "Deployment completed!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:8000"
echo "pgAdmin: http://localhost:5050" 