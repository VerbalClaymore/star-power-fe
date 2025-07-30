# Star Power: Astrological News Reader

## Overview

Star Power is a mobile-first news reader application that combines current events with astrological insights. The app features a React frontend with a Node.js/Express backend, utilizing PostgreSQL for data storage and Drizzle ORM for database management. The application is designed to deliver AI-generated astrological analysis of news articles featuring celebrities and current events.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds
- **Mobile-First Design**: Responsive design optimized for mobile devices with a maximum width of 428px

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **API Design**: RESTful API structure

### Component Architecture
- **UI Components**: Radix UI primitives with custom styling
- **Component Organization**: Atomic design pattern with reusable UI components
- **Styling System**: CSS variables for theming with custom color palette for astrological elements

## Key Components

### Database Schema
The application uses a relational database structure with the following main entities:

1. **Users**: Basic user management with username/password authentication
2. **Categories**: News categories (entertainment, music, celebrity, lifestyle, world, tech)
3. **Actors**: Celebrity profiles with astrological information (sun, moon, rising signs)
4. **Articles**: News articles with astrological analysis, glyphs, and engagement metrics
5. **User Interactions**: Bookmarks and follows for personalization

### Core Features
1. **News Browsing**: Category-based news browsing with horizontal scrolling tabs
2. **Astrological Analysis**: AI-generated astrological insights for each article
3. **Astro Glyphs**: Visual planetary symbols representing astrological themes
4. **Social Features**: Bookmarking, sharing, and engagement tracking
5. **Search Functionality**: Full-text search across articles, hashtags, and actors
6. **Mobile Navigation**: Bottom navigation bar with four main sections
7. **Article Detail View**: Full article display with expanded content and metadata
8. **Actor Profile Pages**: Comprehensive astrological profiles with vibrational circuits and transits

### API Endpoints
- `GET /api/categories` - Retrieve all news categories
- `GET /api/articles` - Get articles with optional category filtering
- `GET /api/articles/:id` - Get single article by ID
- `GET /api/search` - Search articles by query
- `GET /api/actors` - Get all actors
- `GET /api/actors/:id` - Get single actor by ID or slug
- `GET /api/actors/:id/articles` - Get articles featuring specific actor
- Additional endpoints for user interactions (bookmarks, follows)

## Data Flow

1. **Client Request**: User interacts with the mobile interface
2. **Query Processing**: TanStack Query manages API calls and caching
3. **Server Processing**: Express routes handle business logic
4. **Database Operations**: Drizzle ORM executes PostgreSQL queries
5. **Response Formatting**: Structured JSON responses with article details and astrological data
6. **Client Rendering**: React components render the mobile-optimized interface

The application uses a memory-based storage implementation for development, with plans to integrate with a real PostgreSQL database for production.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **drizzle-kit**: Database migration and schema management
- **vite**: Build tool and development server
- **typescript**: Type checking and enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR for frontend
- **Backend Server**: Express server with tsx for TypeScript execution
- **Database**: Configured for Neon Database with environment-based connection string

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations deployed via `drizzle-kit push`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development mode switching via `NODE_ENV`
- Replit-specific optimizations for cloud deployment

The application follows a monorepo structure with shared TypeScript types between client and server, enabling type safety across the full stack. The mobile-first design approach ensures optimal user experience on smartphones while maintaining functionality on larger screens.