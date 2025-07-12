#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying StackIt setup...\n');

// Check if key files exist
const requiredFiles = [
    'package.json',
    'client/index.html',
    'server/index.ts',
    'shared/schema.ts',
    'vite.config.ts',
    'tailwind.config.ts'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.log('❌ Missing required files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    process.exit(1);
}

console.log('✅ All required files present');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('❌ node_modules not found. Please run npm install first.');
    process.exit(1);
}

console.log('✅ Dependencies installed');

// Check if dist directory exists (built application)
if (!fs.existsSync('dist')) {
    console.log('⚠️  dist directory not found. Run npm run build to build the application.');
} else {
    console.log('✅ Application built');
}

// Check environment file
if (!fs.existsSync('.env')) {
    console.log('⚠️  .env file not found. Creating default environment file...');
    
    const envContent = `# Database Configuration
# For local development, you can use a local PostgreSQL instance
# or continue using the in-memory storage
DATABASE_URL=postgresql://username:password@localhost:5432/stackit

# Development Settings
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your-secret-key-here
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Environment file created');
} else {
    console.log('✅ Environment file exists');
}

console.log('\n🎉 Setup verification complete!');
console.log('\nTo start the application:');
console.log('  Development: npm run dev');
console.log('  Production:  npm run build && npm start');
console.log('\nApplication will be available at: http://localhost:5000');