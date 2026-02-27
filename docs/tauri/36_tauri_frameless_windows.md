# ================================================================================ TAURI FRAMELESS & BORDERLESS WINDOWS

You asked: _"Do I need tao and wry? I want to have frameless, borderless. Should
I use something other than Tauri?"_

The short answer is: **No, you don't need to use tao/wry directly, and you
absolutely SHOULD stick with Tauri!**

---

1. WHAT ARE TAO AND WRY?

---

- **tao**: The Rust library that creates the physical window on the screen.
- **wry**: The Rust library that puts the web browser (WebView) inside that
  window.

Tauri uses `tao` and `wry` completely "under the hood." They are the internal
engines. You, as the developer, never have to touch them directly.

---

2. HOW TO GET FRAMELESS / BORDERLESS IN TAURI

---

Tauri was designed perfectly for modern, custom apps (like Discord, Spotify, or
Alien-themed apps). You can turn off the standard Windows/Mac borders with a
single line of code in the `tauri.conf.json` file.

Example of your configuration:

```json
{
  "tauri": {
    "windows": [
      {
        "title": "My School App",
        "width": 800,
        "height": 600,
        "decorations": false,   <-- This makes it borderless/frameless!
        "transparent": true     <-- This allows you to have custom shapes!
      }
    ]
  }
}
```

---

3. BUILDING YOUR OWN BORDERS IN HTML/CSS

---

Once you set `"decorations": false`, the standard close [X], minimize [-], and
maximize [O] buttons disappear, as does the grey title bar.

From that point on, your entire window is just your **Fresh application**. You
build the top bar, the close button, and the drag areas using plain HTML and
CSS.

Tauri gives you a special HTML attribute `data-tauri-drag-region` that you just
put on a `<div>` to let the user drag the custom window around the screen!

---

# SUMMARY: Tauri is the **best** framework right now for building frameless, transparent, or deeply customized desktop apps. It gives you 100% control over the pixels on the screen using the web technologies you are already learning.
