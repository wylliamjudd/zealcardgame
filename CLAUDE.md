# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server using Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Environment Setup
- Create `.env` file with:
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite build tool
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router 7 with nested routing
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: Zustand for global state, React Context for auth/audio
- **Animation**: Framer Motion for smooth transitions

### Core Architecture

The application follows a **section-based SPA architecture** with smooth scrolling navigation between main content areas:

1. **Main Layout Structure** (`src/main.tsx`):
   - `MainLayout` wraps all routes with shared navigation
   - Multiple context providers: `AudioProvider`, `AuthProvider`, `ToastProvider`
   - Router configuration with nested child routes

2. **Section Navigation System** (`src/App.tsx`):
   - Five main sections: Cataclysm (Video Hero), Forum, Cards, Tabletop, Playlist
   - `sectionRefs` array manages scroll positions and active section tracking
   - `StickyMenu` component provides navigation between sections
   - Hash-based routing (`#cataclysm`, `#forum`, etc.) for deep linking

3. **Authentication Flow** (`src/contexts/AuthContext.tsx`):
   - Google OAuth integration with automatic profile creation
   - Role-based access control: `admin`, `moderator`, `user`, `guest`
   - Profile management with automatic fallback creation
   - Robust error handling with generic user-facing messages

### Key Components

- **Forum System** (`src/components/Forum/`):
  - Full forum implementation with categories, threads, posts
  - Role-based permissions and moderation features
  - Real-time updates via Supabase subscriptions

- **Card Game System** (`src/types/cardGame.ts`):
  - Comprehensive card data model with rarities, media, decorations
  - Deck management and card collection functionality

- **Audio System** (`src/components/AudioContext.tsx`):
  - Global audio playback with playlist management
  - Volume control and track navigation

### Database Schema

The project uses Supabase with these key tables:
- `profiles` - User profiles with role-based permissions
- `forum_*` tables - Forum categories, threads, posts
- `card_*` tables - Card game data including masters, instances, media
- `deck` - Player deck management

### Error Handling

Centralized error handling via `src/utils/ErrorUtils.ts`:
- Categorized errors: `AUTH`, `DATA`, `NETWORK`, `VALIDATION`
- Generic user-facing messages to prevent information leakage
- Detailed logging for debugging

### File Structure Patterns

- **Components**: Organized by feature area with co-located types
- **Contexts**: Global state management for cross-cutting concerns  
- **Pages**: Route-level components for distinct application areas
- **Utils**: Shared utilities and helper functions
- **Types**: TypeScript definitions organized by domain

### Development Notes

- Uses `@` alias for `src/` directory imports
- Environment variables prefixed with `VITE_` for client-side access
- Supabase client configured with custom timeout handling
- Real-time subscriptions used for forum updates
- Responsive design with mobile-first approach using Tailwind breakpoints