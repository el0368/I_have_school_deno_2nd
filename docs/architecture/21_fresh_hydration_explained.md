# ================================================================================ FRESH HYDRATION: THE SEQUENCE OF EVENTS

To answer your question: **Yes, the HTML arrives first, but it is a bit more
clever than you might think!**

Fresh uses a sequence called "Hydration" to make sure the user never sees a
blank screen.

---

1. STEP 1: THE SERVER RESPONSE (THE "GHOST" HTML)

---

- THE SERVER (Deno): Renders your entire page, including the Islands, into
  static HTML.
- THE DELIVERY: It sends this finished-looking HTML to the browser.
- THE RESULT: The user see the page instantly. Even the Island buttons are
  visible! However, if you click them _right this second_, they don't work yet.
  This is "Ghost" HTML.

---

2. STEP 2: THE JAVASCRIPT BUNDLE (THE "WAKE UP" CALL)

---

- THE BROWSER: After it shows the HTML, it automatically asks Deno for the
  JavaScript files needed for the Islands.
- THE LOADING: The browser downloads these small files in the background.

---

3. STEP 3: HYDRATION (THE "SOUL" ENTERS THE BODY)

---

- THE ACTION: The browser runs the JavaScript. It finds the "Ghost" HTML on the
  screen and "attaches" the logic (the `onClick` handlers, etc.) to it.
- THE RESULT: The Island is now "Alive." If the user clicks the button now, it
  works!

---

## SUMMARY TABLE: THE TIMELINE

| Time | Event             | What the User Sees              |
| ---- | ----------------- | ------------------------------- |
| 0.1s | HTML Arrives      | The full page (looks finished!) |
| 0.2s | Rendering         | Text, images, and math appear.  |
| 0.5s | JS Bundle Arrives | (No visible change)             |
| 0.6s | **Hydration**     | Buttons now work when clicked!  |

---

## WHY DO WE DO THIS?

# If we sent the JavaScript _with_ the HTML, the user would have to wait longer to see anything. By sending the HTML first, the website feels "instant" even on slow internet connections.
