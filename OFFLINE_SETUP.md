# Offline Setup Guide for StackIt

This guide will help you set up StackIt Q&A platform for offline use.

## Prerequisites

Before starting, ensure you have:
- Node.js 18.0.0 or higher installed
- npm (comes with Node.js)
- Internet connection for initial setup only

## Setup Options

### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Verify setup:**
   ```bash
   node verify-setup.js
   ```

## What Gets Installed

The setup process will:
- Install all Node.js dependencies (React, TypeScript, Tailwind CSS, etc.)
- Create a production build of the application
- Set up environment configuration
- Create necessary directories
- Verify all components are working

## Running Offline

Once setup is complete, you can run the application completely offline:

```bash
# Development mode (with hot reload)
npm run dev

# Production mode (optimized build)
npm start
```

The application will be available at `http://localhost:5000`

## Features Available Offline

All features work offline including:
- ✅ User authentication
- ✅ Question posting and editing
- ✅ Answer system with voting
- ✅ Tag system
- ✅ Search functionality
- ✅ Responsive design
- ✅ Rich text editor
- ✅ Notifications
- ✅ Data persistence (in-memory)

## Data Storage

By default, the application uses in-memory storage which means:
- Data persists while the application is running
- Data is lost when the server restarts
- Perfect for development and testing

For permanent data storage, you can configure PostgreSQL (requires separate installation).

## File Structure

After setup, you'll have:
```
stackit/
├── setup.sh              # Linux/Mac setup script
├── setup.bat             # Windows setup script
├── verify-setup.js       # Setup verification
├── README.md             # Full documentation
├── OFFLINE_SETUP.md      # This file
├── .env                  # Environment configuration
├── node_modules/         # Dependencies (installed)
├── dist/                 # Built application
└── [project files]
```

## Troubleshooting

### Common Issues

1. **"Node.js not found"**
   - Install Node.js from https://nodejs.org/
   - Restart your terminal/command prompt

2. **"npm install fails"**
   - Clear npm cache: `npm cache clean --force`
   - Try again: `npm install`

3. **"Port 5000 already in use"**
   - Change port in `.env` file: `PORT=3000`
   - Or find and kill the process using port 5000

4. **"Setup script won't run"**
   - On Linux/Mac: `chmod +x setup.sh`
   - On Windows: Run as administrator

### Verification

Run the verification script to check your setup:
```bash
node verify-setup.js
```

This will check:
- All required files are present
- Dependencies are installed
- Environment is configured
- Application is built

## Next Steps

After successful setup:
1. Start the application with `npm run dev`
2. Open `http://localhost:5000` in your browser
3. Create your first user account
4. Start asking and answering questions!

## Support

If you encounter issues:
1. Check the console for error messages
2. Run `node verify-setup.js` to diagnose problems
3. Refer to the full README.md for detailed troubleshooting

---

This setup creates a fully functional Q&A platform that works entirely offline after the initial installation.