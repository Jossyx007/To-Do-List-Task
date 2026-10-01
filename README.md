# TaskFlow — Modern To-Do & Notes Productivity App

A lightweight, distraction-free personal productivity web application combining an organized task manager and digital notepad. Inspired by modern productivity interfaces such as Todoist, Things 3, and Notion.

---

## 🌟 Key Features

### 1. Dashboard
- **Friendly Greeting & Date**: Dynamic time-of-day greeting ("Good morning / afternoon / evening") with formatted date.
- **Task Completion Progress Indicator**: Visual progress bar tracking completed vs. total tasks.
- **Compact Metric Cards**: Total Tasks, Pending Tasks, Completed Tasks, and Total Notes.
- **Priority & Upcoming Spotlight**: Instant view of high-priority and due tasks.
- **Quick Capture Form**: Add tasks directly from the dashboard.

### 2. Task Management
- **Fast Entry**: Add tasks with title and press `Enter` to create.
- **Priority Categorization**: Color-coded badges for **Low** (Slate), **Medium** (Amber), and **High** (Rose).
- **Due Date Tracking**: Intelligent indicators for **Overdue**, **Due Today**, and **Upcoming** dates.
- **Task Descriptions**: Optional expandable notes and details.
- **Filtering & Sorting**: Filter by *All*, *Pending*, and *Completed*. Sort by *Due Date*, *Priority*, or *Date Created*.
- **Editing & Safe Deletion**: In-place editing modal and confirmation modal before permanent deletion.

### 3. Dedicated Notes
- **Card Grid Layout**: Clean responsive layout displaying note titles and preview snippets.
- **Rich Timestamps**: Tracks both creation date and humanized last updated timestamp (e.g. "Updated 5m ago").
- **Modal Note Editor**: Distraction-free editing environment with live word and character counters.
- **Keyword Search**: Filter notes instantly by title or content.

### 4. Global Search
- Global search input in the header matching task titles, descriptions, note titles, and note content.
- Quick keyboard shortcut: Press `/` anywhere to focus the search bar.

### 5. Data Persistence
- **100% Client-Side**: Stored in browser `LocalStorage` with zero latency and complete privacy.
- **Schema Migration**: Automatically upgrades data from legacy versions without losing records.
- **Offline Capable**: Works entirely offline with no backend or cloud dependencies.

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Storage**: Browser `window.localStorage`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone or navigate to the project directory
cd todo-notes-app

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
This compiles TypeScript and outputs optimized, minified production assets to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Runs a local web server serving the `dist/` build.

---

## 📦 Deployment Guide

### Deploying to Vercel
1. Install Vercel CLI or connect your GitHub repository to [Vercel](https://vercel.com).
2. Set the build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy!

### Deploying to Netlify
1. Connect repository to [Netlify](https://www.netlify.com).
2. Set build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Deploy!
