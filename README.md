# Sync2gether

Real-time synchronized video playback across multiple devices using Firebase for ms-level precision.

## Features
- **Perfect Sync**: Drift compensation keeps devices within ±50ms.
- **PWA Ready**: Installable on mobile/desktop with offline UI.
- **Zero Login**: Instant room creation with shareable links.
- **Privacy Focus**: Ephemeral rooms, no user tracking.

## Setup Guide

### 1. Installation
```bash
npm install
```

### 2. Firebase Configuration
1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Create a **Realtime Database** and set rules to public (for demo) or authenticated.
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
3. Copy the configuration keys.
4. Rename `.env.local.example` to `.env.local`.
5. Fill in your Firebase credentials.

### 3. Run Locally
```bash
npm run dev
```

### 4. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` and follow the prompts.
3. Set Environment Variables in Vercel dashboard matching your `.env.local`.

## Usage
1. Open the app and click "Create New Room".
2. Share the generated URL or Room ID with friends.
3. Paste a YouTube link and click "Load".
4. Play, pause, or seek - everyone syncs instantly.
