# 🌟 Aura Daily — Personal Productivity Dashboard

A sleek, modern, single-page personal productivity dashboard built with **React 19**, **Tailwind CSS v4**, and **Vite**.

![Dashboard Preview](https://img.shields.io/badge/Aura-Productivity-indigo?style=for-the-badge)

---

## ✨ Features Included

### 1. 🕒 Live Digital Clock & Calendar
- Real-time digital clock with seconds indicator and live pulse dot.
- Toggle between **12-Hour (AM/PM)** and **24-Hour** military format.
- Displays full day of week, formatted date, and local timezone name.

### 2. 💬 Customizable Greeting & Daily Quotes / Mantra
- Time-of-day dynamic greeting (*Good morning*, *Good afternoon*, *Good evening*, *Good night*).
- Clickable & customizable user name stored in `localStorage`.
- Curated daily wisdom bank featuring timeless quotes on focus, discipline, and simplicity.
- **Custom Mantra Editor**: Enter your personal quote or affirmation for the day, saved locally.
- Quick copy-to-clipboard button.

### 3. ✅ Interactive To-Do List
- Add tasks with title, **Priority** (*High, Medium, Low*), and **Category** (*Focus, Work, Personal, Learning*).
- Mark complete with instant audio chime feedback and confetti celebration upon clearing tasks!
- Progress bar displaying completed task percentage.
- Filter tabs: **All**, **Active**, **Completed**, plus a quick search bar.
- Inline task title editing and deletion.
- Persisted seamlessly in `localStorage`.

### 4. 🍅 Built-In Pomodoro Focus Timer
- 25-minute standard focus block countdown.
- Modes: **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
- Circular SVG progress ring that animates as seconds count down.
- **Start**, **Pause**, and **Reset** controls with **+1m** and **+5m** quick extensions.
- Dynamic browser tab title updater: see remaining time directly from any browser tab (*e.g., `(24:15) Focus | Aura`*).
- Web Audio API notification chime upon session completion.
- Completed session streak counter.

### 5. 📝 Quick Minimalist Scratchpad Notes
- Minimalist distraction-free notes editor.
- Automatic background auto-saving to `localStorage` on every keystroke with a live "Saved" indicator.
- Word count and character count.
- Insert live timestamp `[HH:MM]` or bullet points with one click.
- One-click copy note to clipboard or download as a `.txt` file.

### 6. 🎨 Ambient Aesthetic Themes & Keyboard Shortcuts
- 4 curated ambient themes: *Obsidian Night*, *Cyber Slate*, *Deep Forest*, and *Sunset Aura*.
- Keyboard shortcuts:
  - `Space`: Toggle Pomodoro timer
  - `N`: Quick focus on Add Task input
  - `T`: Switch theme
  - `?`: Open keyboard shortcuts cheat sheet

---

## 🚀 Getting Started

### Local Development
```bash
# Navigate to project
cd "C:\Users\USER\.gemini\antigravity\scratch\productivity-dashboard"

# Start the dev server
npm run dev
```

Visit [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your web browser.

### Production Build
```bash
npm run build
npm run preview
```
