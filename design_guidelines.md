# Design Guidelines: AI-Powered News Aggregator

## Design Approach

**Hybrid Reference + System Approach**
- Primary inspiration: Apple News (content-first), Flipboard (card-based discovery), Google News (personalization)
- Foundation: Material Design for consistent component behavior and information architecture
- Focus: Clean, scannable news consumption with clear AI-powered insights

## Core Design Elements

### A. Typography
**Font Family:** Inter (via Google Fonts CDN)
- Headlines: 600 weight, 1.5rem - 2rem
- Article titles: 500 weight, 1.125rem - 1.25rem
- Body text: 400 weight, 0.875rem - 1rem
- Category tags: 500 weight, 0.75rem - 0.875rem
- Metadata (source, date): 400 weight, 0.75rem

### B. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Card padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Margins: m-4, m-8, m-12
- Component spacing: space-y-4, space-x-4

**Grid Structure:**
- Desktop: 3-column news grid (grid-cols-3)
- Tablet: 2-column (md:grid-cols-2)
- Mobile: Single column (grid-cols-1)
- Container: max-w-7xl with responsive padding

### C. Component Library

**Header/Navigation:**
- Sticky top navigation with logo, search bar, and filter toggles
- Real-time search input with icon
- Category filter pills (horizontal scroll on mobile)
- Sentiment filter toggles (All, Positive, Neutral, Negative)

**News Cards:**
- Card structure: Image (16:9 aspect ratio) → Content area
- Article image at top (w-full, rounded-t-lg)
- Content section: Category badge + Sentiment badge → Headline → Source + Date → Excerpt
- Hover: Subtle elevation increase (shadow transition)
- Click: Navigate to full article

**Sentiment Badges:**
- Positive: Pill-shaped badge with subtle accent
- Neutral: Muted pill badge
- Negative: Distinct but not alarming pill badge
- Position: Top-right corner of card content area, inline with category

**Category Tags:**
- Small pill badges (e.g., "Technology", "Sports", "Politics")
- Position: Top-left of card content, above headline
- Multiple categories: Horizontal flex layout with gap-2

**Search & Filters Panel:**
- Sticky filter bar below header
- Search input: Full-width on mobile, max-w-md on desktop
- Category chips: Horizontal scrollable row
- Sentiment filters: Button group with active state indicators
- Date range picker: Compact dropdown selector

**Loading States:**
- Skeleton screens for news cards while fetching
- Shimmer animation effect on placeholder cards
- Progressive loading: Show cards as they're processed

**Empty States:**
- Centered message when no results match filters
- Helpful suggestions to adjust filters
- Icon + heading + description layout

**Article Detail Modal/Page:**
- Full article view with larger image
- Headline + byline + publish date
- AI-generated category tags displayed prominently
- Sentiment analysis summary
- Source attribution with link to original article

### D. Images

**Hero Section:**
- Large hero image (h-64 to h-96) showing curated "Top Story" of the day
- Overlaid content: Headline + category + sentiment badge
- Gradient overlay from transparent to semi-opaque for text readability
- CTA button: "Read Full Story" with blurred background (backdrop-blur)

**Article Card Images:**
- 16:9 aspect ratio thumbnail for each article
- Object-fit: cover to maintain aspect ratio
- Placeholder: Neutral gray background with newspaper icon when image unavailable
- Loading: Skeleton with subtle pulse animation

**Image Placement:**
- Every news card includes article image at top
- Hero section features single large featured story image
- Category section headers may include subtle background images

## Page Structure

**Main Feed Layout:**
1. Hero section: Featured story with large image (h-64 md:h-96)
2. Filter bar: Search + Category pills + Sentiment toggles (sticky)
3. News grid: 3-column responsive card layout with gap-6
4. Infinite scroll or "Load More" button at bottom

**Responsiveness:**
- Mobile: Single column, smaller text, collapsible filters
- Tablet: 2-column grid, medium spacing
- Desktop: 3-column grid, full filter visibility, larger cards

## Interaction Patterns

**Card Interactions:**
- Hover: Slight shadow elevation increase
- Click: Open article detail or navigate to source
- Favorite/bookmark: Icon button in card corner (optional)

**Filter Interactions:**
- Category pills: Toggle active state (fill vs outline)
- Sentiment buttons: Radio-style selection with active state
- Search: Real-time filtering with debounced input
- Clear filters: Single "Reset" button to clear all

**No Animations:** Minimal animations limited to:
- Card hover elevation (subtle transition)
- Skeleton loading shimmer
- Filter toggle states (instant feedback)

## Key Considerations

- **Content First:** News headlines and images should dominate, AI insights (categories/sentiment) are supporting metadata
- **Scannability:** Clear visual hierarchy, ample whitespace between cards, consistent card heights
- **Mobile Optimization:** Touch-friendly targets, readable text sizes, easy one-handed filtering
- **Performance:** Lazy load images, virtual scrolling for large datasets, optimized sentiment badge rendering
- **Accessibility:** High contrast for sentiment badges, keyboard navigation for filters, ARIA labels for AI-generated content