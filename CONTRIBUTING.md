# Contributing to Sovereign Academy

We are building a massive, open-source educational platform. We follow strict
standards to ensure the project remains fast, accessible, and high-quality.

## Adding New Curriculum Content

All lessons are written in **MDX3**.

### 1. File Organization

Content lives in the `curriculums/` directory. Structure your content by
subject, grade, and unit.

**Structure:** `curriculums/[subject]/[grade]/[unit_folder]/[lesson].mdx`

**Example:**
`curriculums/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9.mdx`

### 2. File Naming

- Use lowercase.
- Use underscores instead of spaces.
- Number your lessons to ensure correct order in the sidebar (e.g.,
  `1_intro.mdx`).

### 3. Formatting Lessons

- Use `#` for the main lesson title.
- Use `##` and `###` for sub-sections.
- For math, use LaTeX syntax: `$ \frac{1}{2} $` for inline or `$$ ... $$` for
  blocks.
- **Rule**: Do not add Layout or Sidebar components manually; the virtual router
  handles this for you!

## Developing New Features

### Tech Stack

- **Framework**: Fresh 2.x
- **Engine**: Vite
- **Styling**: Tailwind CSS
- **Database**: PGlite (WASM)

### Creating UI Components

- **Pure CSS/Static**: Use `.tsx` in `components/`.
- **Interactive**: Use `.tsx` in `islands/`.
- **Logic**: Favor Rust/WASM for complex data processing.

## Documentation Standards

- Keep documentation in the `docs/` folder.
- Use `.md` for formal documentation.
- Use numbering prefixes to indicate reading order (e.g., `01_intro.md`).
