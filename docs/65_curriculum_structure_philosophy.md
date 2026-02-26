You should not create folders for each exercise type. In a professional
curriculum, organization should follow **mathematical topics**, not the way a
student clicks a button. A student goes to your school to learn "Quadratic
Equations," not to learn "Multiple Choice."

Here is the most efficient way to organize your exercises for long-term
scalability.

### 1. The Folder Hierarchy (Topic-First)

Your folders should reflect the **Subject and Skill**, exactly as you have
started in your `subjects/math/by_topics/` directory.

- **Folder:** `subjects/math/by_topics/algebra/`
- **File:** `quadratic_formula.mdx`

Within this one `quadratic_formula.mdx` file, you will define every type of
exercise related to that specific topic. This keeps your "Blueprints" in the
same place as your "Lesson Content," making it much easier to update the
curriculum later.

### 2. The "Exercise Block" Organization

Inside your topic file, you organize the different question types into **Logical
Blocks**. Instead of separate files, use clear sections that the frontend
"Practice Island" can read:

- **Section A: The Concept (Multiple Choice)** Here you define the blueprints
  for checking if they understand the formula's purpose.
- **Section B: The Calculation (Symbolic Input)** Here you define the blueprints
  for solving equations using the formula.
- **Section C: The Mastery (Scribble/Writing)** Here you define the complex
  challenge problems that require the iPad handwriting feature.

### 3. How to Define "Types" without Folders

Instead of a folder, each exercise in your MDX file should have a **Type
Metadata Tag**. When your Deno frontend reads the file, it looks at the tag to
decide which UI to show:

- If the tag is `type: "scribble"`, the app opens the drawing canvas.
- If the tag is `type: "multiple_choice"`, the app shows four buttons.
- If the tag is `type: "symbolic"`, the app opens the math keypad.

### 4. The "Blueprint" vs. "Static" Distinction

Within your topic file, you should organize your content into two categories:

1. **Hand-Crafted Examples:** A few specific, beautiful problems that you want
   every student to see because they teach a specific edge case.
2. **The Generator Logic:** The "Rules" (constraints) that tell the Rust engine
   how to make 1,000 more versions of those problems.

### 5. Why this is better than "Folder-per-Type"

- **Cohesion:** If you decide to change how you teach "Fractions," you only have
  to open one file. You don't have to hunt through a "Multiple Choice" folder, a
  "Scribble" folder, and a "Fill-in-the-blank" folder.
- **Navigation:** Your navigation menu remains clean. It shows a list of math
  skills, which is what a student expects to see.
- **Engine Routing:** Your Deno backend can easily see the "Topic" and "Grade
  Level" from the file path, allowing it to instantly decide whether to use the
  Fast Path (SymEngine) or the Deep Path (SymPy).

### Summary Recommendation

Proceed by keeping your current topic-based folder structure. Inside each
topic's MDX file, create a "Playlist" of exercises. Use tags to identify the
interaction type for each question. This creates a "Single Source of Truth" for
every mathematical skill in your academy.
