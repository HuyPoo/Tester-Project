#!/bin/sh

IMAGE_VERSION=1.0

# Build backend image
docker build -t virgo-14-backend:${IMAGE_VERSION} -f docker/Backend.Dockerfile backend

# Build frontend image
docker build -t virgo-14-frontend:${IMAGE_VERSION} -f docker/Frontend.Dockerfile frontend
