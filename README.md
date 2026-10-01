# 🌟 Aura Daily — Personal Productivity Dashboard

A sleek, modern, single-page personal productivity dashboard built with **React 19**, **Tailwind CSS v4**, and **Vite**.

![Dashboard Status](https://img.shields.io/badge/Aura-Production%20Ready-amber?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)

---

## ✨ Features

- **🕒 Live Digital Clock & Calendar**: High-contrast digital clock with seconds, 12H/24H toggle, live pulse indicator, full date, and timezone.
- **💬 Customizable Greeting & Mantra**: Time-of-day greeting (*Good morning, afternoon, evening*), editable user name, curated quote shuffle, and custom daily mantra saved locally.
- **✅ Interactive To-Do List**: Priority badges (*High, Medium, Low*), categories (*Focus, Work, Personal, Learning*), progress bar, filters (*All, Active, Completed*), search, audio chimes, and celebration confetti.
- **🍅 Built-in Pomodoro Focus Timer**: 25-minute focus sprints, short/long breaks, circular SVG animated ring, audio chime, streak counter, and dynamic browser tab title updater.
- **📝 Quick Minimalist Scratchpad**: Distraction-free scratchpad with auto-save to `localStorage`, word/character counters, one-click copy, timestamp insertion, and `.txt` export.
- **🎨 Warm & Energetic Theme**: Clean light cream background, crisp white panels, vibrant golden-amber accents, and high-contrast dark charcoal text.
- **⌨️ Keyboard Shortcuts**: `Space` (Start/Pause timer), `N` (Add task), `T` (Cycle themes), `?` (Shortcuts cheat sheet).

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Pushing to GitHub & Deploying to Vercel

### Step 1: Push to GitHub

1. Create a new empty repository on [GitHub](https://github.com/new) (e.g. `productivity-dashboard`). Do not initialize with README, .gitignore, or license.
2. In your local terminal, add the remote and push:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/productivity-dashboard.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** > **"Project"**.
3. Select your newly created GitHub repository.
4. Vercel automatically detects the project settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your application will be live worldwide in seconds!
