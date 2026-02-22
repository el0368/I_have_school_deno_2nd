# System Architecture: Sovereign Academy

This document outlines the professional standards and architectural patterns
used in Sovereign Academy.

## 1. Content Collections (Real-World Standard)

To manage hundreds of educational lessons without cluttering the application
logic, we use a **Content Collection** pattern.

- **Content Storage**: All educational material (MDX files) is stored in the
  `curriculums/` directory.
- **Data-Driven Routing**: The application does not use physical route files for
  lessons. Instead, it "discovers" content in `curriculums/` and handles the URL
  mapping virtually.
- **Separation of Concerns**: Writers work in `curriculums/`, while developers
  work in `routes/` and `components/`.

## 2. The Virtual MDX Router

We utilize a "Bulletproof" virtual routing system to bypass Fresh 2.x
serialization limitations and provide a unified layout.

### How it works:

1. **Auto-Discovery**: `mdx-routes.ts` uses Vite's `import.meta.glob` to scan
   the `curriculums/` folder at build time.
2. **Request Interception**: `main.ts` listens for all requests. Any path
   starting with `/learn/` is intercepted.
3. **Server-Side Rendering**: The router finds the matching MDX file, wraps it
   in the `CurriculumLayout` component, and renders it directly to HTML on the
   server.

### Key Benefits:

- **No 500 Errors**: Prevents Preact component serialization crashes.
- **Unified UI**: Sidebar, Breadcrumbs, and "Mark Complete" buttons are defined
  once in `CurriculumLayout.tsx` and applied to every lesson automatically.
- **URL Normalization**: Handles trailing slashes (e.g., `/learn/math/` vs
  `/learn/math`) automatically.

## 3. Data Strategy

We distinguish between **Content** and **Data**:

| Type         | Format     | Location       | Purpose                                  |
| :----------- | :--------- | :------------- | :--------------------------------------- |
| **Content**  | MDX        | `curriculums/` | Lessons, textbook text, math equations.  |
| **Progress** | JSON / SQL | PGlite         | Student scores, mastery levels, history. |

### Offline-First Progress

Because the app is designed for **Tauri** (Desktop/Mobile), student progress is
stored locally using **PGlite (WASM PostgreSQL)**. This allows the app to work
entirely without an internet connection.

## 4. UI Design Philosophy

- **Frameless Window**: Designed for Tauri's custom window controls.
- **Tailwind CSS**: Used for rapid, consistent styling.
- **Preact Islands**: Interactivity (like counters or quiz components) is
  isolated to `islands/` to minimize client-side JavaScript.
