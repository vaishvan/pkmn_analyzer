#!/bin/bash

# Pokemon Analyzer Backend Deployment Script
echo "🚀 Starting Pokemon Analyzer Backend Deployment"

# Check if required environment variables are set
if [ -z "$GOOGLE_GEMINI_API_KEY" ]; then
    echo "❌ Error: GOOGLE_GEMINI_API_KEY environment variable is required"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run any pre-deployment health checks
echo "🔍 Running health checks..."
node -e "
const pkg = require('./package.json');
console.log('✅ Package.json is valid');
console.log('📋 Service:', pkg.name, 'v' + pkg.version);
"

# Start the application
echo "🎯 Starting Pokemon Analyzer Backend..."
exec npm start
