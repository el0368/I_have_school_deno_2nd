# ================================================================================ FRESH: THE DEFAULT "NATIVE" FILES

In a standard Fresh project, there are 4 main file types that are recognized
automatically inside the `routes/` folder. Everything else is ignored unless we
add custom code (like we did for MDX).

---

1. THE "PAGE" FILES (.tsx and .jsx)

---

- **Role**: These are for your User Interface (UI).
- **Behavior**: Fresh automatically turns these into URLs.
  - `routes/about.tsx` becomes `my-site.com/about`
- **Output**: They must export a Preact component (HTML structure).

---

2. THE "API" FILES (.ts and .js)

---

- **Role**: These are for data, not UI.
- **Behavior**: If you have a file that doesn't need to show a webpage (like a
  file that just sends JSON data to a mobile app), you use these.
- **Output**: They export "Handlers" instead of "Components".

---

3. THE "SPECIAL" FILES (The Underscores)

---

Fresh looks for a few special files starting with an underscore `_`:

- `_app.tsx`: The "Wrapper". Every single page on your site is wrapped inside
  this file. It's where we put the `<head>` and global styles.
- `_middleware.ts`: Code that runs _before_ a page loads (good for checking if a
  user is logged in).
- `_404.tsx`: The custom "Page Not Found" screen.

---

SUMMARY:

| File Extension | Role                   | Automatic?              |
| :------------- | :--------------------- | :---------------------- |
| **.tsx**       | HTML Page + TypeScript | **YES**                 |
| **.jsx**       | HTML Page + JavaScript | **YES**                 |
| **.ts**        | API / Logic            | **YES**                 |
| **.js**        | API / Logic            | **YES**                 |
| **.mdx**       | Content / Markdown     | **NO** (We added this!) |

# By default, Fresh ignores `.mdx` because it considers it "Data" or "Content", not "Code". That's why we had to build our own MDX "Bridge".
