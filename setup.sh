#!/bin/bash

echo "🚀 Setting up StackIt Q&A Platform..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️  Creating environment file..."
    cat > .env << EOF
# Database Configuration
# For local development, you can use a local PostgreSQL instance
# or continue using the in-memory storage
DATABASE_URL=postgresql://username:password@localhost:5432/stackit

# Development Settings
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your-secret-key-here
EOF
    echo "✅ Environment file created (.env)"
    echo "   Please update the DATABASE_URL and SESSION_SECRET as needed"
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
mkdir -p dist
mkdir -p logs

echo ""
echo "🏗️  Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To run the application:"
echo "  Development mode: npm run dev"
echo "  Production mode:  npm start"
echo ""
echo "The application will be available at: http://localhost:5000"
echo ""
echo "📋 What's included:"
echo "  ✅ All dependencies installed"
echo "  ✅ Environment file created"
echo "  ✅ Application built for production"
echo "  ✅ Ready for offline use"
echo ""
echo "📖 For more information, see the README.md file"