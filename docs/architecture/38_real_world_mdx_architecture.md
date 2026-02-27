# ================================================================================ ARCHITECTURE: HOW THE "REAL WORLD" DOES MDX

You asked: _"How would the real world accomplish this?"_

When companies (like Vercel, Stripe, or Supabase) build large documentation
sites or academies using Markdown/MDX, they never put hundreds of `.mdx` files
directly into their `routes/` folder.

Instead, they use a pattern called **"Content Collections" (or "Data Driven
Routing")**.

---

## THE REAL-WORLD FOLDER STRUCTURE

Here is what a professional project looks like:

```text
my-academy/
├── curriculums/               <-- 1. THE DATABASE (Content)
│   ├── math/
│   │   ├── algebra.mdx
│   │   ├── geometry.mdx
│   ├── physics/
│       ├── forces.mdx
│
├── routes/                    <-- 2. THE WEBSITE (Code)
│   ├── index.tsx              (Home Page)
│   ├── learn/
│   │   ├── [subject]/
│   │   │   ├── [lesson].tsx   <-- 3. THE "MAGIC" TEMPLATE
```

---

## HOW IT WORKS (The "Magic" Template)

Instead of having 500 routes for 500 math lessons, you only have **ONE** route:
`routes/learn/[subject]/[lesson].tsx`.

Notice the **brackets `[]`**. In Fresh (and Next.js), brackets mean the route is
**Dynamic**.

1. A user visits: `your-site.com/learn/math/algebra`
2. Fresh loads `[lesson].tsx`.
3. The `.tsx` code sees that the user asked for `math` and `algebra`.
4. The `.tsx` code reaches into the `curriculums/math/` folder, grabs
   `algebra.mdx`, wraps it in a beautiful Sidebar and Header, and shows it to
   the user!

---

## WHY IS THIS THE PROFESSIONAL WAY?

If you put `algebra.mdx` directly into the `routes/` folder, the Markdown file
itself is in charge of the URL and the layout. That means if you want to add a
"Next Lesson" button to all 500 lessons, you have to edit 500 `.mdx` files.

With the **Content Collection** pattern:

1. **Total Control**: The `[lesson].tsx` file controls the layout. You design
   the sidebar once, and all 500 lessons instantly get it.
2. **Clean Separation**: Your `curriculums/` folder is pure content (for
   writers). Your `routes/` folder is pure code (for programmers).

---

## MY RECOMMENDATION FOR YOU:

If you are planning to have dozens or hundreds of lessons:

1. Create `C:\GitHub\I_have_school_deno_2nd\curriculums\math\`.
2. Move your converted `.mdx` files there.
3. Keep them **out** of the `routes/` folder.
4. # We will build a single Dynamic Route (`[lesson].tsx`) to display them!
