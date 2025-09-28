#!/bin/bash
# Build the application
echo "Building the app..."
npm run build

# Copy built files to root for GitHub Pages deployment
echo "Copying files to root directory..."
cp -r dist/* .

echo "Deployment files ready for GitHub Pages!"



