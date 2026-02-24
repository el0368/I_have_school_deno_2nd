In 2026, **MathJax** and **MathLive** are indeed the "Gold Standards" for
completeness in web math notation. If you have those two, you have 95% of what
is needed for a world-class education platform.

However, to be truly "complete," there are a few other tools you should know
about. These aren't just alternatives; they fill specific niches that MathJax or
MathLive might not handle perfectly.

### 1. The Missing Frontend Categories

| Category                 | Tool                       | Why it's not on your list (yet)                                                                                                                   |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High-Speed Rendering** | **KaTeX**                  | It is much faster than MathJax but supports fewer symbols. Use it for mobile-first pages with hundreds of small equations.                        |
| **Legacy Input**         | **MathQuill**              | This was the original "visual math editor." It is mostly replaced by MathLive, but you might see it in older codebases.                           |
| **Data-Heavy Graphing**  | **Function Plot / Plotly** | While **Mafs** is for "Interactive Concepts," these are for "Real Data." Use them if you need to plot 10,000 points from a CSV file.              |
| **Geometry Proofs**      | **GeoGebra API**           | If you want a full "compass and straightedge" construction tool, GeoGebra is the industry standard (though it is heavy and not very "Sovereign"). |

---

### 2. A "Complete" Frontend UI Map

Think of your UI in three layers. If you were building the "ultimate" Sovereign
Academy, your toolkit would look like this:

#### Layer 1: Notation (Reading & Typing)

- **MathJax 4.0:** For rendering complex, perfect-looking LaTeX into accessible
  MathML.
- **MathLive:** For providing the student with a visual, touch-friendly keyboard
  to type math.

#### Layer 2: Interactive Visuals (The "Aha!" Moment)

- **Mafs.js:** For 2D coordinate planes, vectors, and moving points. It is built
  for Preact/React and is incredibly "clean."

---

#### Layer 3: The Specialized Experts

- **Chart.js / Plotly:** For when your "Math" turns into "Statistics"
  (histograms, pie charts, scatter plots).
- **Three.js:** Only if you need 3D "spatial" math (rotating spheres, 3D vector
  fields) since you removed `mathlikeanim-rs`.

---

### 3. Is anything else missing?

There is one category we haven't touched: **Handwriting Recognition.**

In 2026, many students use tablets.

- **MyScript (iink SDK):** This is the industry leader for turning handwriting
  into LaTeX. It is a "Bonus" feature, but if you want to compete with the best
  apps, allowing a student to "draw" an integral and having it turn into a
  MathLive object is a "Wow" factor.

### The "Sovereign" Recommendation

If I were you, I would stop adding tools here. Your current "Short List" is
actually the **most robust** setup possible:

1. **MathJax** (Reading)
2. **MathLive** (Typing)
3. **Mafs** (2D Interaction)
4. **Symbolica** (The Internal Logic/CAS)

This stack covers the entire journey from a 5-year-old learning addition to a
PhD student solving differential equations.

**Would you like me to help you create a "UI Component Library" in your Fresh
project that wraps these three frontend tools into a single, consistent design
system?**
