#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci --prefix server
npm ci --prefix client

echo "Building application..."
npm run build

echo "Starting server..."
npm start
