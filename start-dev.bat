@echo off
echo 🚀 Starting AutoPartZone Development Servers...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
call npm install

echo 📦 Installing backend dependencies...
cd autopartzone-backend
call npm install
cd ..

echo 🗄️ Seeding database with sample data...
cd autopartzone-backend
call node seedData.js
cd ..

echo 🎯 Starting development servers...

echo Starting backend server on port 5001...
cd autopartzone-backend
start "Backend Server" cmd /c "npm start"
cd ..

echo Starting frontend server on port 5173...
start "Frontend Server" cmd /c "npm run dev"

echo.
echo ✅ Development servers started!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5001
echo.
echo Press any key to close this window...
pause >nul