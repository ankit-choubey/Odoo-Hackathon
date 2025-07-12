@echo off
echo 🚀 Setting up StackIt Q&A Platform...
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo.
    echo ⚙️  Creating environment file...
    (
        echo # Database Configuration
        echo # For local development, you can use a local PostgreSQL instance
        echo # or continue using the in-memory storage
        echo DATABASE_URL=postgresql://username:password@localhost:5432/stackit
        echo.
        echo # Development Settings
        echo NODE_ENV=development
        echo PORT=5000
        echo.
        echo # Session Configuration
        echo SESSION_SECRET=your-secret-key-here
    ) > .env
    echo ✅ Environment file created ^(.env^)
    echo    Please update the DATABASE_URL and SESSION_SECRET as needed
) else (
    echo ✅ Environment file already exists
)

REM Create necessary directories
if not exist "dist" mkdir dist
if not exist "logs" mkdir logs

echo.
echo 🏗️  Building the application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

echo.
echo 🎉 Setup completed successfully!
echo.
echo To run the application:
echo   Development mode: npm run dev
echo   Production mode:  npm start
echo.
echo The application will be available at: http://localhost:5000
echo.
echo 📋 What's included:
echo   ✅ All dependencies installed
echo   ✅ Environment file created
echo   ✅ Application built for production
echo   ✅ Ready for offline use
echo.
echo 📖 For more information, see the README.md file
pause