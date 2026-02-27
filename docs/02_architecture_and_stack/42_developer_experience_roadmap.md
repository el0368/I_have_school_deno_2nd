# Developer Experience Roadmap

This document outlines the recommended "Life Saver" tools and architectural
patterns for Sovereign Academy as it scales from a prototype to a full
production-ready platform.

## 1. State Management (Preact Signals)

**Why**: As Islands grow in number, passing props between them (prop-drilling)
becomes unsustainable. **Solution**: Use `@preact/signals` for "Global Stores."
**Benefit**: Any Island can read or update things like student scores or theme
state instantly without being directly linked to another component.

## 2. Dedicated Database Layer (`db.ts`)

**Why**: Writing raw SQL inside UI components (`.tsx`) makes code harder to
maintain and test. **Solution**: Create `utils/db.ts` to encapsulate all PGlite
logic into named functions. **Benefit**: Centralizes data access. If the
database schema or the database itself (PGlite) changes, you only update one
file rather than dozens of components.

## 3. Centralized Theming (CSS Variables)

**Why**: Hardcoding hex colors like `#3b82f6` in CSS or components makes it
impossible to implement site-wide changes quickly. **Solution**: Define all
colors, spacing, and fonts as CSS Custom Properties in `assets/styles.css`.
**Benefit**: Enables effortless support for "Dark Mode" and high-contrast
accessibility themes simply by swapping root variables.

## 4. Automation: Linters and Formatters

**Why**: Inconsistent code styling and minor syntax errors (like unused imports)
lead to build failures and bugs. **Solution**: Integrate `deno fmt` and
`deno lint` into the pre-commit workflow. **Benefit**: Ensures that every file
follows professional standards automatically before the code is even saved to
the repository.

## 5. End-to-End (E2E) Testing

**Why**: Manually checking 500+ math lessons for rendering errors after every
code change is impossible. **Solution**: Use **Playwright** (already in
`deno.json`) to write automated "Smoke Tests." **Benefit**: A single command can
scan every lesson URL and confirm that the curriculum is still fully
operational.

---

Implementing these five upgrades will transform the "Sovereign Academy"
development experience into a fast, safe, and professional environment.
