# Project Introduction: Sovereign Academy

Welcome to the Sovereign Academy development environment. This application is
built using the latest **Fresh 2.x** framework, optimized for speed, offline
capabilities, and professional educational standards.

## 1. Core Technology Stack

- **Runtime**: [Deno (v2.0+)](https://deno.com/)
- **Framework**: [Fresh 2.x](https://fresh.deno.dev/)
- **Build Engine**: [Vite](https://vitejs.dev/)
- **UI Library**: [Preact](https://preactjs.com/)
- **WASM Support**: Rust (compiled to WebAssembly)
- **Database**: PGlite (PostgreSQL running in the browser/WASM)

## 2. Key Feature: Native MDX3 Support

This project is specially configured to support **MDX3**. This allows you to
write educational content in Markdown format while blending in interactive
components.

### Virtual Routing

We use a **Bulletproof Virtual Router**. Instead of creating hundreds of files
in the `routes/` folder, all curriculum content is stored in the `curriculums/`
directory. The application automatically discovers these files and serves them
via the `/learn/` path.

## 3. Project Structure

- `routes/`: System pages (Home, Settings, Dashboard).
- `curriculums/`: The "Heart" of the app. All MDX educational lessons.
- `islands/`: Interactive Preact components (Counters, Quizzes, Widgets).
- `components/`: Static UI elements and layouts.
- `wasm/`: Rust source code and compiled WASM packages.
- `docs/`: Technical guides and documentation.

## 4. Getting Started

1. **Start Development Server**:
   ```bash
   deno task dev
   ```
2. **Access the App**: Open [http://localhost:5173](http://localhost:5173).
3. **View a Lesson**: Visit
   `/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9`.
