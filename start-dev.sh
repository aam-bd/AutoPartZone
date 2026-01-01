#!/bin/bash

# AutoPartZone Development Setup Script
echo "🚀 Starting AutoPartZone Development Servers..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   You can still run the app if you update MONGO_URI in .env file."
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd autopartzone-backend
npm install
cd ..

echo "🗄️  Seeding database with sample data..."
cd autopartzone-backend
node seedData.js
cd ..

echo "🔧 Setting up environment variables..."

# Create .env file for backend if it doesn't exist
if [ ! -f "autopartzone-backend/.env" ]; then
    cp autopartzone-backend/.env.example autopartzone-backend/.env
    echo "✅ Created .env file for backend. Please update MongoDB connection string."
fi

# Create .env file for frontend if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env already exists. Please review it."
fi

echo "🎯 Starting development servers..."

# Start both servers concurrently
echo "Starting backend server on port 5001..."
cd autopartzone-backend
npm start &
BACKEND_PID=$!
cd ..

echo "Starting frontend server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development servers started!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait