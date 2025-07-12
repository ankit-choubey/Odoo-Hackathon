# StackIt - Q&A Platform

## Overview

StackIt is a full-stack question-and-answer platform built with a modern tech stack. It provides a Stack Overflow-like experience where users can ask questions, provide answers, vote on content, and build reputation within the community. The application uses a monorepo structure with a clear separation between client, server, and shared code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a **monorepo fullstack architecture** with the following structure:

- **Frontend**: React with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth integration
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository containing client, server, and shared code for easier development and deployment
2. **TypeScript Throughout**: End-to-end type safety across all layers
3. **Drizzle ORM**: Type-safe database queries with schema-first approach
4. **Component-Based UI**: Reusable UI components with consistent design system

## Key Components

### Frontend Architecture
- **React Router**: wouter for client-side routing
- **Component Library**: shadcn/ui components for consistent UI
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables for theming
- **Rich Text Editing**: Custom RichTextEditor component for question/answer content

### Backend Architecture
- **Express.js Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL connection via Neon serverless
- **Authentication**: Replit OAuth with session management using connect-pg-simple
- **Storage Pattern**: Abstract storage interface with concrete implementations

### Database Schema
The application uses the following core entities:
- **Users**: Authentication and profile information with reputation system
- **Questions**: Main content with title, content, author, and view tracking
- **Answers**: Responses to questions with acceptance mechanism
- **Tags**: Categorization system for questions
- **Votes**: Upvote/downvote system for questions and answers
- **Notifications**: User notification system

## Data Flow

1. **Authentication Flow**: 
   - Users authenticate via Replit OAuth
   - Sessions stored in PostgreSQL using connect-pg-simple
   - User information cached in React Query

2. **Question Lifecycle**:
   - Questions created with rich text content and tags
   - View count incremented on access
   - Answers can be submitted and voted on
   - Question authors can accept answers

3. **Voting System**:
   - Users can upvote/downvote questions and answers
   - Vote changes affect user reputation
   - Real-time vote count updates

4. **Notification System**:
   - Users receive notifications for answer activity
   - Unread count tracking with periodic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/***: Headless UI components
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### Authentication
- **passport**: Authentication middleware
- **openid-client**: OAuth implementation for Replit auth
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI/UX
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library

## Deployment Strategy

The application is optimized for **Replit deployment** with the following considerations:

1. **Build Process**:
   - Frontend built with Vite to `dist/public`
   - Backend bundled with esbuild to `dist/index.js`
   - Single production command starts the Express server

2. **Development Environment**:
   - Vite dev server with HMR for frontend development
   - Express server with automatic restart via tsx
   - Database migrations handled via Drizzle Kit

3. **Environment Configuration**:
   - Database URL from environment variables
   - Session secrets for authentication
   - Replit-specific domain configuration

4. **Static Asset Serving**:
   - Production mode serves static files from Express
   - Development mode uses Vite's dev server with middleware

The architecture supports both development and production environments with minimal configuration changes, making it ideal for rapid prototyping and deployment on Replit's platform.