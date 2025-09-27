# CincoPalabras Web

A Progressive Web App (PWA) for learning 100 Spanish nouns with Russian transcription and translation. The app provides daily lessons with 5 new words and interactive tests to reinforce learning.

## Features

- 📚 **Daily Lessons**: Learn 5 new Spanish words each day
- 🧠 **Interactive Tests**: Test your knowledge with multiple choice questions
- 📱 **PWA Support**: Install as a native app on any device
- 💾 **Offline Support**: Works without internet connection
- 🔔 **Notifications**: Daily reminders to study (with iOS limitations)
- 📊 **Progress Tracking**: Track your learning progress and statistics
- 🌐 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Database**: Dexie (IndexedDB)
- **Routing**: React Router
- **Testing**: Vitest + React Testing Library
- **PWA**: Vite PWA Plugin
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/v3nusrb/cincopalabras-web.git
cd cincopalabras-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### GitHub Pages (Automatic)

The app is automatically deployed to GitHub Pages when you push to the main branch:

**Live URL**: https://v3nusrb.github.io/cincopalabras-web/

### Manual Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Manual Deployment to Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

## PWA Installation

### Desktop (Chrome/Edge)
1. Click the install button in the address bar
2. Or go to Settings > Apps > Install this site as an app

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (3 dots) > "Add to Home screen"

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## iOS PWA Limitations

Due to iOS Safari limitations, the following features may not work as expected:

- **Notifications**: Only work when the PWA is added to home screen
- **Background Notifications**: May not work reliably in background mode
- **Notification Scheduling**: Limited functionality in background
- **User Interaction**: Must interact with the app before notifications can be shown
- **Character Limits**: Notifications are limited to 64 characters total

## Project Structure

```
src/
├── components/          # Reusable UI components
├── db/                 # Database models and services
├── hooks/              # Custom React hooks
├── routes/             # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── test/               # Test files
```

## Database Schema

- **Words**: Spanish words with transcription and Russian translation
- **Lessons**: Daily lesson data with word IDs
- **TestSessions**: Test results and statistics
- **Settings**: User preferences and app configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

**Live App**: https://v3nusrb.github.io/cincopalabras-web/
