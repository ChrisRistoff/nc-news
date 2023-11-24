#!/bin/bash

set -e

CONTAINER_NAME="nc_news_c"
IMAGE_NAME="nc_news"
APP_DIR="$HOME/nc-news"

echo "Starting deployment..."

cd "$APP_DIR"

echo "Pulling latest changes from Git..."
git pull origin main

echo "Stopping the existing Docker container..."
sudo docker stop $CONTAINER_NAME || true
sudo docker rm $CONTAINER_NAME || true

echo "Building the new Docker image..."
sudo docker build -t $IMAGE_NAME .

echo "Running the new Docker container..."
sudo docker run -p 80:80 -d --name $CONTAINER_NAME $IMAGE_NAME

echo "Removing unused Docker images..."
sudo docker image prune -af

echo "Deployment successful!"
