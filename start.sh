#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci --prefix server --include=dev
npm ci --prefix client --include=dev

echo "Building application..."
npm run build

echo "Starting server..."
npm start
