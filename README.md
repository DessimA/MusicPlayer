# MusicPlayer

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![YouTube Data API](https://img.shields.io/badge/YouTube_Data_API-v3-FF0000?logo=youtube&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
[![GitHub](https://img.shields.io/badge/GitHub-DessimA-181717?logo=github&logoColor=white)](https://github.com/DessimA/MusicPlayer)

Music player powered by YouTube Data API v3. Built with React, Vite, and Docker. Features Google OAuth PKCE authentication, mobile-first responsive design, and full audio playback via the YouTube IFrame Player API.

## Architecture

```mermaid
graph TD
    A[index.html] --> B[main.jsx]
    B --> C[App.jsx]
    C --> D[Home.jsx]
    D --> E{Authenticated?}
    E -->|No| F[Login]
    E -->|Yes| G[BrowserRouter]
    G --> H[Sidebar]
    G --> I[BottomNavigation]
    G --> J{Routes}
    J -->|"/"| K[Library]
    J -->|"/player"| L[Player]
    L --> M[AudioPlayer]
    L --> N[Queue]
    M --> O[ProgressCircle]
    M --> P[WaveAnimation]
    M --> Q[Controls]
```

## Google OAuth PKCE Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Google
    User->>App: Click Sign In
    App->>App: Generate code_verifier
    App->>App: Compute SHA-256 code_challenge
    App->>Google: GET /o/oauth2/auth?client_id&code_challenge&redirect_uri
    Google->>User: Login & authorize (youtube.readonly, userinfo.profile)
    Google->>App: Redirect with ?code=AUTHORIZATION_CODE
    App->>App: Clean URL (remove ?code)
    App->>Google: POST /token (code + verifier)
    Google->>App: {access_token, refresh_token, expires_in}
    App->>App: Store in localStorage
    App->>App: Set axios Authorization header
    App->>User: Render Library
```

## Playback State

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: Playlist selected
    Loading --> Ready: Tracks loaded
    Ready --> Playing: Play pressed
    Playing --> Paused: Pause pressed
    Paused --> Playing: Play pressed
    Playing --> Ready: Track ended / Next / Prev
    Ready --> Idle: Playlist changed
    Loading --> Error: Network failure
    Error --> Loading: Retry
```

## Project Structure

```
musicplayer/
├── Dockerfile               Multi-stage production build
├── Dockerfile.dev           Development with hot-reload
├── docker-compose.yml       Dev environment
├── docker-compose.prod.yml  Production environment
├── nginx/default.conf       Production nginx with CSP
├── index.html               Entry HTML with CSP meta tags
├── vite.config.js           Vite configuration
├── vitest.config.js         Test configuration
└── src/
    ├── main.jsx              Entry point
    ├── App.jsx               Root component
    ├── api/                  YouTube/Google API layer
    │   ├── auth.js           Google OAuth PKCE
    │   ├── client.js         Axios instance
    │   └── endpoints.js      API URLs & scopes
    ├── hooks/                React hooks
    │   ├── useAuth.js        Auth state management
    │   ├── usePlaylistTracks.js  YouTube playlist item fetching
    │   └── useAudioPlayer.js     YouTube IFrame Player playback
    ├── utils/
    │   └── formatters.js     formatDuration
    ├── styles/
    │   ├── variables.module.css  Design tokens
    │   └── global.css            Reset & base styles
    ├── screens/
    │   ├── Home/             Auth gate & router
    │   ├── Login/            Google sign-in
    │   ├── Library/          YouTube playlist grid
    │   └── Player/           Full player view with video + queue
    ├── components/
    │   ├── Sidebar/          Desktop navigation
    │   ├── BottomNavigation/ Mobile navigation
    │   ├── SongCard/         Video thumbnail + info
    │   ├── Queue/            Track list with search
    │   ├── AudioPlayer/      Controls & visualizers
    │   └── ui/               Primitives (Spinner, ErrorMessage, EmptyState, SkeletonLoader)
    └── tests/
        └── setup.js
```

## Data Flow

```mermaid
flowchart LR
    A[YouTube Data API v3] <--> B[api/client.js]
    B <--> C[Hooks]
    C <--> D[Components/Screens]
    D <--> E[User]
    F[localStorage] <--> C
    G[api/auth.js] <--> H[Google OAuth 2.0]
    H <--> F
```

## Docker

```mermaid
flowchart LR
    subgraph Production
        A[Source Code] --> B[npm ci]
        B --> C[vite build]
        C --> D[dist/]
        D --> E[nginx:alpine]
        E --> F[Port 80]
    end
    subgraph Development
        G[Source Code] --> H[npm ci]
        H --> I[vite --host 3000]
        I --> J[Hot Reload via bind mount]
    end
```

## Setup

### Prerequisites

- Docker & Docker Compose (recommended) or Node.js 20+
- [Google Cloud Console account](https://console.cloud.google.com/) (free, no credit card required)

### Google API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Application type: **Web application**
7. Add `http://127.0.0.1:3000` and `http://localhost:3000` as **Authorized JavaScript origins** and **Authorized redirect URIs**
8. Copy the **Client ID** and **Client Secret**
9. (Optional) Create an **API Key** for additional YouTube Data API access

### Environment

```bash
cp .env.example .env
# Edit .env with your Google Client ID and Client Secret
```

> The OAuth client type is **Web application** (confidential client), so `client_secret` is required in the token exchange body even with PKCE.

### Add test users

1. Go to Google Cloud Console → **APIs & Services** → **OAuth consent screen**
2. Add your Google email as a **Test user**
3. Publishing status must be **Testing** unless you verify the app

### Docker (recommended)

```bash
# Development (hot-reload)
docker compose up

# Production build
docker compose -f docker-compose.prod.yml up
```

Open http://localhost:3000

### Without Docker

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build to dist/
npm test          # Run tests
```

## Features

- **Google OAuth PKCE** for secure, token-based authentication (no client secret exposed to server)
- **YouTube IFrame Player** provides full audio playback with video visibility toggle
- **Background playback** audio continues when switching tabs or minimizing video
- **Minimizable video** hide video to save screen space while music plays
- **Searchable queue** filter tracks within the current playlist
- **localStorage** persists tokens across page refreshes (recommended by Google OAuth docs)
- **Auto token refresh** via refresh_token grant
- **Error handling** on all API calls with user-facing fallback UI
- **Loading states** with skeleton loaders and spinners
- **Empty states** when playlists or tracks are unavailable
- **Mobile-first responsive design** with bottom navigation
- **CSS Modules** for scoped, conflict-free styles
- **Minimalist UI** clean, flat buttons with consistent sizing
- **Custom hooks** `useAuth`, `usePlaylistTracks`, `useAudioPlayer` encapsulate logic
- **Docker multi-stage builds** for development and production
- **17 unit/integration tests** with Vitest
- **No hardcoded secrets** Google credentials via environment variables
- **CSP headers** in both HTML meta tag and nginx production config
- **Info modal** accessible from sidebar and bottom navigation
- **MIT licensed** with contributing and security guidelines

## Documentation

- [MIT License](LICENSE)
- [Terms of Use](TERMS.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
