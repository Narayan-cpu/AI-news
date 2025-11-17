# AI-Powered News Aggregator

## Overview

An intelligent news aggregation platform that fetches articles from EventRegistry API and enriches them with AI-powered categorization and sentiment analysis using Groq's Llama model. The application provides a content-first browsing experience with real-time filtering by category, sentiment, and search queries.

**Core Purpose**: Deliver personalized news consumption with intelligent AI insights, combining third-party news APIs with LLM-based analysis to help users discover and understand news stories through automated categorization and sentiment detection.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**:
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Framework**:
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Theme system supporting light/dark modes via context provider
- Design inspired by Apple News, Flipboard, and Google News (per design guidelines)

**Component Structure**:
- Card-based news layout with responsive grid (3-column desktop, 2-column tablet, 1-column mobile)
- Modal-based article detail view with full content display
- Filter bar with debounced search, category pills, and sentiment toggles
- Hero section featuring top article with gradient overlays
- Skeleton loading states for progressive content rendering

**State Management Pattern**:
- React Query for server data with 5-minute cache TTL
- React hooks (useState) for local UI state (filters, modals, theme)
- Debounced search input (500ms) to reduce API calls
- Query key-based cache invalidation on filter changes

### Backend Architecture

**Server Framework**:
- Express.js with TypeScript for type-safe API development
- ESM module system throughout the codebase
- Vite middleware integration for SSR-ready development

**API Design**:
- RESTful `/api/news` endpoint with query parameter filtering
- Zod schema validation for request parameters
- Comprehensive error handling with typed error responses
- Request/response logging middleware for debugging

**Data Flow**:
1. Client requests news with optional filters (query, category, sentiment, country, date range)
2. Server checks in-memory cache using stringified parameter keys
3. On cache miss: fetch from EventRegistry API or search endpoint
4. Batch process articles through Groq AI for enrichment (category + sentiment)
5. Cache enriched results for 5 minutes
6. Return filtered results based on sentiment if specified

**AI Integration (Groq)**:
- Llama 3.3 70B model for text analysis
- Batch processing of articles for efficiency
- Parallel categorization and sentiment analysis in single LLM call
- Temperature: 0.3 for consistent, deterministic results
- Retry logic with exponential backoff for rate limiting (429 responses)
- JSON output parsing with fallback defaults

**Caching Strategy**:
- In-memory Map-based cache with TTL-based expiration (5 minutes)
- Cache keys generated from request parameters (query, category)
- Automatic cache invalidation on TTL expiration
- No persistent storage - cache rebuilds on server restart

**News Data Transformation**:
- EventRegistry articles transformed to standardized schema
- Category mapping from EventRegistry taxonomy to simplified categories (business, technology, science, health, sports, entertainment)
- Country code mapping for localized news (US, GB, CA, AU, IN)
- Date/time normalization to ISO format

### Data Storage Solutions

**Current Implementation**:
- In-memory storage for user data (MemStorage class) - development only
- No persistent database currently connected
- Session-based storage using connect-pg-simple (PostgreSQL session store configured but not actively used)

**Drizzle ORM Configuration**:
- Configured for PostgreSQL dialect with connection pooling via Neon Database serverless driver
- Schema defined in `shared/schema.ts` with Zod integration
- Migration support configured but not actively used (no tables defined)
- Ready for future user authentication and article bookmarking features

**Schema Design**:
- User schema defined but using in-memory storage
- Article data stored ephemerally in cache, not persisted
- Sentiment and category data computed on-demand, cached in memory

### Authentication and Authorization

**Current State**: No authentication implemented. Application is publicly accessible.

**Prepared Infrastructure**:
- User schema with id, username fields defined
- Storage interface supports user CRUD operations
- Session store configuration present but inactive

### External Dependencies

**News API (EventRegistry)**:
- **Purpose**: Primary news article source with global coverage
- **Integration**: REST API via fetch calls
- **Authentication**: API key via `NEWS_API_KEY` environment variable
- **Key Features**: 
  - Top headlines by category and country
  - Article search with date range filtering
  - Multi-language support
  - Source and sentiment metadata

**AI Provider (Groq)**:
- **Purpose**: LLM-based article categorization and sentiment analysis
- **Integration**: OpenAI-compatible REST API
- **Authentication**: API key via `GROQ_API_KEY` environment variable
- **Model**: llama-3.3-70b
- **Rate Limiting**: Built-in retry logic with exponential backoff
- **Output Format**: Structured JSON with category and sentiment fields

**UI Component Libraries**:
- **Radix UI**: Headless accessible components for dialogs, dropdowns, tooltips, etc.
- **Shadcn/ui**: Pre-styled component layer over Radix primitives
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date formatting and manipulation

**Font Delivery**:
- **Google Fonts CDN**: Inter font family (weights 400, 500, 600, 700)
- Preconnect optimization for faster font loading

**Build Tools**:
- **Vite**: Frontend bundler with HMR and optimized production builds
- **esbuild**: Backend bundler for server code
- **TypeScript**: Type checking across client, server, and shared code
- **Tailwind CSS**: Utility-first styling with PostCSS processing

