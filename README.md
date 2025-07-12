# StackIt - Q&A Platform

A modern, full-stack Q&A platform similar to Stack Overflow, built with React, TypeScript, and Node.js.

## Features

- 🔐 User authentication and authorization
- 📝 Rich text editor for questions and answers
- 🏷️ Tag system for organizing questions
- 👍 Voting system for questions and answers
- 🔍 Search functionality
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔔 Notification system
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📊 Pagination for question lists
- 🔄 Real-time updates with React Query

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd stackit
   ```

2. **Run the setup script:**
   
   **On Linux/Mac:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   
   **On Windows:**
   ```cmd
   setup.bat
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:5000`

### Manual Installation

If you prefer to install manually:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start development server
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run client:dev` - Start frontend development server only
- `npm run server:dev` - Start backend development server only

## Project Structure

```
stackit/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # utility functions
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                 # Backend Node.js application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schemas and types
└── package.json
```

## Configuration

The application uses environment variables for configuration. The setup script creates a `.env` file with default values:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/stackit

# Development Settings
NODE_ENV=development
PORT=5000

# Session Configuration
SESSION_SECRET=your-secret-key-here
```

### Database Setup

The application currently uses in-memory storage for development. To use PostgreSQL:

1. Install PostgreSQL locally
2. Create a database named `stackit`
3. Update the `DATABASE_URL` in your `.env` file
4. The application will automatically create the necessary tables

## Technologies Used

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - State management
- **Wouter** - Routing
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database (optional)

## Features in Detail

### User Authentication
- Session-based authentication
- User roles (Guest, User, Admin)
- Secure password handling

### Question & Answer System
- Rich text editor with formatting options
- Syntax highlighting for code blocks
- Image upload support
- Tag system for categorization

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Collapsible navigation menu

### Search & Filtering
- Full-text search across questions
- Filter by tags, status, and date
- Sort by votes, activity, and creation date

## Development

### Adding New Features

1. **Database Schema**: Update `shared/schema.ts` first
2. **Storage Layer**: Add methods to `server/storage.ts`
3. **API Routes**: Create endpoints in `server/routes.ts`
4. **Frontend**: Add components and pages in `client/src/`

### Code Style

- Use TypeScript for type safety
- Follow the existing component structure
- Use shadcn/ui components when possible
- Implement responsive design for all new features

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your-production-database-url
SESSION_SECRET=your-strong-session-secret
```

## Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - Change the PORT in your `.env` file
   - Or kill the process using port 5000

2. **Dependencies installation fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Build fails**
   - Check Node.js version (must be 18+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Look at the server logs in the terminal
3. Verify your Node.js version is 18+
4. Ensure all dependencies are installed

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

Built with ❤️ using modern web technologies.