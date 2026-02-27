We have not explicitly mapped out that exact UI flow yet, but you have just
pointed out **one of the absolute biggest advantages of using MDX.**

You are completely right: **you do not need to create separate `.mdx` files for
the lesson and the practice exercises.** Because MDX allows you to embed
interactive React/Preact components directly inside standard Markdown text, you
can merge the "Learning" phase and the "Practice" phase into a single, seamless
file.

Here is how you execute that "Lesson -> Practice" flow within a single `.mdx`
file.

### The Single-File Architecture

Instead of having `/learn/addition.mdx` and `/practice/addition.mdx`, you have
one single file.

The top half is the static text and LaTeX explaining the concept. The bottom
half is your `<PracticeIsland />` Preact component that takes over the screen
and generates the infinite questions.

Here is exactly what that `.mdx` file looks like:

```mdx
---
title: "Adding Within 20"
topic: "addition"
grades: ["grade_1", "grade_2"]
---

# Let's Learn: Adding Within 20

When we add two numbers together, we are finding the total amount.
For example, if you have 8 apples and you get 5 more, you can count up to find the answer:
$$ 8 + 5 = 13 $$

---

## Your Turn to Practice

*Complete 5 questions correctly in a row to master this skill.*

<PracticeIsland
  topicId="addition_within_20"
  blueprint={{
    variables: [
      { name: "A", min: 1, max: 10 },
      { name: "B", min: 1, max: 10 }
    ],
    template: "A + B = C",
    targetStreak: 5
  }}
/>
```

### How the "Few More Pages" Flow Works (Without Changing URLs)

When the student scrolls down to the `<PracticeIsland />` component, they don't
actually leave the page. The Preact component handles the "pages" internally.

1. **The Lesson View:** The student reads the text.
2. **The Start Button:** The `<PracticeIsland />` renders a big "Start Practice"
   button.
3. **The Interface Switch:** When they click "Start Practice," the Preact
   component can visually hide the lesson text (or just scroll them down) and
   display Question 1.
4. **The Loop:** When they hit "Check Answer," the component fetches the next
   question from your Axum server and updates the UI to Question 2, Question 3,
   etc., all without refreshing the web browser or loading a new file.
5. **The Mastery Screen:** Once they hit 5 correct in a row, the component
   displays a "Congratulations! You mastered this!" screen with a button that
   says "Go to Next Topic," which triggers your router to load the next `.mdx`
   file in the sequence.

### The Major Benefits of This Approach

- **Zero Folder Clutter:** Your codebase stays incredibly clean. One
  mathematical concept = exactly one `.mdx` file.
- **Frictionless UX:** The student doesn't have to navigate back to a main menu
  to find the "Practice Quiz" for what they just read. It is waiting for them
  right at the bottom of the page.
- **Contextual Help:** If a student gets stuck on question 3, they can literally
  just scroll up to read the lesson text again, because they are still on the
  exact same webpage.

Would you like me to write the Preact code for how that `<PracticeIsland />`
component seamlessly handles the transition from "Reading Mode" to "Answering
Math Questions Mode" within the same page?
