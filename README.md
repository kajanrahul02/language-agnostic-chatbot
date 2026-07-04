# Polyglot AI: Multi-Language Conversational Chatbot with Gemini Intelligence

An advanced, full-stack language-agnostic AI chatbot powered by Google Gemini and Google Cloud Firebase. **Polyglot AI** instantly detects user input in over 100 languages, translates the input to English for internal processing, and replies fluently in the user's native language. It integrates **Firebase Authentication**, dynamic **AI Mode Selectors**, and **Image Vision Understanding** for an immersive multilingual experience.

---

## 🌟 Features

- **Instant Language Detection**: Automatically detects user inputs in Malayalam, Tamil, Hindi, German, Japanese, Spanish, French, and over 100 other languages.
- **Dynamic AI Mode Selector**:
  - **⚡ Lite / Fast**: Super-fast responses using `gemini-3.1-flash-lite`.
  - **✨ General (Pro)**: High-quality assistance powered by `gemini-3.5-flash`.
  - **🧠 Thinking Mode**: Deep reasoning capabilities using `gemini-3.1-pro-preview` with High Thinking Config enabled.
  - **📍 Maps Grounded**: Retrieves real-time coordinates and location grounding details with Google Maps data tools.
- **Image Upload & Vision Analysis**: Upload any image and chat with the AI for visual explanations using `gemini-3.1-pro-preview`.
- **Integrated Firebase Authentication**: Safe login flow supporting:
  - Google Sign-In (OAuth popup).
  - Email & Password (Sign up / Sign in).
  - Instant Guest Access (anonymous sign-in).
- **Responsive Speak-Back (TTS)**: Translates responses and reads them out loud with appropriate phonetic accents.
- **Real-Time Sentiment Analysis**: Monitors the conversation sentiment score dynamically.
- **Premium Glassmorphic UI**: Ambient twilight dark/light modes styled with Tailwind CSS, custom mesh backgrounds, and smooth micro-animations.

---

## 📁 Project Structure

```text
├── .env.example                # Template for environment configurations
├── .gitignore                  # Prevents committing dependencies and builds
├── index.html                  # HTML template entry point
├── metadata.json               # Application configurations and permissions
├── package.json                # Project dependencies and deployment scripts
├── server.ts                   # Custom Express server with Vite Dev middleware and Gemini router
├── tsconfig.json               # TypeScript configurations
├── vite.config.ts              # Vite asset bundle configurations
├── src/
│   ├── App.tsx                 # Main Application component & Auth Router
│   ├── main.tsx                # Client-side React entry point
│   ├── index.css               # Tailwind CSS styles and custom gradient meshes
│   ├── types.ts                # TypeScript shared types and interfaces
│   ├── components/
│   │   ├── ChatBox.tsx         # Message rendering (images, translations, TTS)
│   │   ├── Header.tsx          # Current detected language and status indicator
│   │   ├── InputArea.tsx       # Prompt submission, voice rec, images, and mode selector
│   │   ├── LoginPage.tsx       # Auth UI (Google, Email, Guest)
│   │   ├── Sidebar.tsx         # Conversation history, sentiment metrics, user profiles, and settings
│   │   ├── LanguagesModal.tsx  # Interactive catalog of supported languages
│   │   └── ProjectReportModal.tsx # Architectural dashboard and report
│   └── lib/
│       ├── firebase.ts         # Firebase App initialization (Firestore & Auth)
│       ├── languages.ts        # Language metadata and presets
│       └── speech.ts           # Speech Synthesis and Web Speech Recognition API wrapper
```

---

## 🚀 Getting Started (Local Run)

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **Firebase Project Credentials** (from the Firebase Console)
- **Gemini API Key** (from Google AI Studio)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-github-repo-url>
cd polyglot-ai

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your keys:

```env
# Gemini API Configuration
GEMINI_API_KEY="your-gemini-api-key-here"

# App Location (for OAuth callbacks/production)
APP_URL="http://localhost:3000"
```

### 3. Start Development Server

Run the unified full-stack server (Vite + Express):

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000) to view and test the application!

---

## 🛠️ Build and Deploying to Production

### Local Build

To compile the React SPA client and compile the TypeScript Express server into a highly optimized bundled CommonJS file:

```bash
npm run build
```

This generates:
- `dist/` - static web frontend assets.
- `dist/server.cjs` - compiled, production-ready server.

### Run in Production

```bash
npm start
```

---

## 📝 How to Upload This Project to GitHub

1. Initialize a new git repository locally (if not already done):
   ```bash
   git init
   ```
2. Stage all the project files:
   ```bash
   git add .
   ```
3. Commit your initial state:
   ```bash
   git commit -m "feat: complete polyglot chatbot with firebase auth, thinking mode, maps grounding, and image vision"
   ```
4. Create a new repository on [GitHub](https://github.com/new).
5. Link your local project to the remote GitHub repository and push:
   ```bash
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
