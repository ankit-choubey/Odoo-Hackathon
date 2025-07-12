# StackIt - Q&A Platform

## Overview

StackIt is a full-stack Q&A platform similar to Stack Overflow, built with modern web technologies. The application allows users to ask questions, provide answers, vote on content, and engage in a community-driven knowledge sharing experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **UI Components**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: Hot Module Replacement (HMR) via Vite middleware

### Authentication & Authorization
- **Strategy**: Session-based authentication with PostgreSQL storage
- **Mock Implementation**: Currently uses in-memory mock data for development
- **User Roles**: Support for user, admin, and guest roles
- **Authorization**: Role-based access control throughout the application

## Key Components

### Database Schema
The application uses a comprehensive schema with the following entities:
- **Users**: User profiles with reputation system
- **Questions**: Questions with voting, tagging, and view tracking
- **Answers**: Answers with voting and accepted answer functionality
- **Votes**: Voting system for questions and answers
- **Notifications**: User notification system
- **Tags**: Question categorization system

### UI Components
- **Rich Text Editor**: Custom editor for question and answer content
- **Voting System**: Upvote/downvote functionality for content
- **Tag System**: Tag input and management
- **Notification System**: Real-time notifications for user interactions
- **Search**: Question search functionality
- **Responsive Design**: Mobile-first approach with desktop optimization

### Core Features
- **Question Management**: Create, view, edit, and delete questions
- **Answer Management**: Provide and manage answers to questions
- **Voting System**: Community-driven content ranking
- **Tag System**: Organize questions by topics
- **User Profiles**: Reputation system and user management
- **Search**: Find questions by title, content, or tags
- **Notifications**: Stay updated on question/answer activity

## Data Flow

1. **User Authentication**: Session-based authentication with PostgreSQL storage
2. **Question Creation**: Users create questions with rich text content and tags
3. **Answer Submission**: Users provide answers to questions
4. **Voting**: Community votes on questions and answers
5. **Reputation System**: Users gain reputation based on votes received
6. **Notifications**: Users receive notifications for activity on their content
7. **Search**: Real-time search across questions and content

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon Database serverless
- **Drizzle ORM**: Type-safe database operations with schema management
- **Drizzle Kit**: Database migration and schema management tools

### UI/UX
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Development
- **Server**: Express.js with Vite middleware for HMR
- **Database**: Uses DATABASE_URL environment variable
- **Hot Reloading**: Full-stack hot reloading for development

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Static Assets**: Frontend built to `dist/public` directory
- **Server**: Node.js Express server serving API and static files
- **Database**: PostgreSQL connection via environment variables

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx for TypeScript execution
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: Configurable via `DATABASE_URL` environment variable

The application follows a modern full-stack architecture with type safety throughout, comprehensive error handling, and a focus on developer experience and user interface quality.