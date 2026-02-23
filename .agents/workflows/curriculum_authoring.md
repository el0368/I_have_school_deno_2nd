---
description: How to write and run curriculum lessons, start the dev server, and use the MathJax/MathLive interactive math stack.
---

# Sovereign Academy: Curriculum Authoring Workflow

> **AI Agents**: Read `GEMINI.md` before proceeding. All MDX math safety rules
> are defined there.

---

## Step 1: Start the Development Server

```bash
deno task dev
```

The Vite dev server starts at `http://127.0.0.1:5173/`. Hot Module Replacement
(HMR) automatically reloads MDX files on save.

---

## Step 2: Create Your Lesson File

Navigate to the correct subject, grade, and unit inside `curriculums/`, then
create a numbered `.mdx` file:

```
curriculums/math/grade_1/unit_1_place_value/3_my_new_lesson.mdx
```

The virtual router will auto-discover it and serve it at:

```
/learn/math/grade_1/unit_1_place_value/3_my_new_lesson
```

---

## Step 3: Write Static Content with MathJax

Use standard Markdown for text. Use `$` and `$$` for math. MathJax automatically
converts LaTeX to native MathML — no setup needed.

```mdx
# Adding Tens

When you add $10$ to any number, the **tens digit** goes up by one.

$$36 + 10 = 46$$

Notice: The ones digit ($6$) stays the same. Only the tens digit changed!
```

**Safety rule**: Never use `{}` inside a math block. Write complex descriptions
as plain Markdown outside the `$$` block instead.

---

## Step 4: Add an Interactive Practice Box (MathLive)

When the student needs to type a math answer, import the Island component:

```mdx
import MathInput from "../../islands/MathInput.tsx";

## Your Turn

What is $52 + 10$?

<MathInput />
```

When the student types in the box, MathLive generates both a `latex` string and
`math-ml` output that can be sent to the WASM validation engine.

---

## Step 5: Preview Your Lesson

Browse to your lesson URL in the browser. Changes to the `.mdx` file are
reflected instantly via HMR without a server restart.

---

## Step 6: Quick Checklist Before Committing

- [ ] No raw `{}` inside LaTeX math blocks.
- [ ] Comparison operators `<` and `>` are padded with spaces in inline math:
      `$ a < b $`.
- [ ] File is numbered correctly (e.g., `3_` for third topic in unit).
- [ ] Math renders correctly in the browser.
- [ ] No 500 errors in the Vite terminal output.
