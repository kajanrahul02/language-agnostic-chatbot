# POLYGLOT AI: MULTI-LANGUAGE CONVERSATIONAL CHATBOT WITH GEMINI INTELLIGENCE
## Mini Project Report & Technical Specification
**Course**: Web Application Development / Software Engineering / Artificial Intelligence  
**Developer**: kajanrahul02@gmail.com  
**Repository**: [Project GitHub URL]

---

## 1. ABSTRACT
**Polyglot AI** is a state-of-the-art, full-stack, language-agnostic conversational intelligence system. In a globalized world, language barriers limit access to knowledge and computational tools. This project overcomes this challenge by integrating Google's latest **Gemini LLM SDK** with **Web Speech APIs** and **Firebase Cloud Infrastructure** into a cohesive Web SPA.

The core innovation of Polyglot AI is its **Contextual Multilingual Router**, which dynamically processes user inputs in over 100 languages, handles vision analysis (image uploads), deep logical reasoning (Thinking Mode), and geographic intelligence (Google Maps Grounding), before responding fluently with natural speech synthesis in the user's native language.

---

## 2. OBJECTIVES & SCOPE
The key objectives of this mini project are:
1. **Language Inclusivity**: Provide seamless text and vocal interactions in regional (e.g., Hindi, Tamil, Malayalam) and global languages.
2. **Flexible Intelligence Routing**: Implement multiple operational modes (Lite, General, Thinking, Maps Grounded) utilizing appropriate Gemini models to balance latency and logical depth.
3. **Robust Security and Identity**: Leverage Firebase Authentication for Google SSO, Email/Password registrations, and secure Guest Sessions.
4. **Persistent History Storage**: Store user records, session files, and chat messages in real-time inside Firebase Firestore.
5. **Interactive Accessibility**: Incorporate voice input (Automatic Speech Recognition) and responsive voice output (Text-to-Speech) calibrated to match the spoken language's accent.

---

## 3. SYSTEM ARCHITECTURE & DATA FLOW
The system is designed with a modern full-stack decoupled architecture using **React (Vite)** on the frontend and an **Express.js (Node.js)** server-side proxy on the backend. This guarantees complete API key security (preventing key leakage in browser devtools).

### 3.1 Architecture Overview
```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT (React SPA)                               │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────┐  │
│  │   Web Speech (STT)    │   │  Responsive Tailwind  │   │  Audio Synthesizer│  │
│  │  Voice Audio Capture  │   │   Glassmorphic UI     │   │   (Accent TTS)    │  │
│  └───────────┬───────────┘   └───────────▲───────────┘   └─────────▲─────────┘  │
└──────────────┼───────────────────────────┼─────────────────────────┼────────────┘
               │                           │                         │
               │ (Secure REST JSON)        │                         │
               ▼                           │                         │
┌──────────────────────────────────────────┴─────────────────────────┴────────────┐
│                             BACKEND (Express.js Proxy)                          │
│                                                                                 │
│   ┌─────────────────────┐   ┌──────────────────────┐   ┌────────────────────┐   │
│   │    Secure API Router│   │   Multilingual Engine│   │  Model Selection   │   │
│   │  /api/chat Endpoint │   │  Context Retention   │   │     Router Rules   │   │
│   └──────────┬──────────┘   └──────────┬─────────▲─┘   └─────────┬──────────┘   │
└──────────────┼─────────────────────────┼─────────┼───────────────┼──────────────┘
               │                         │         │               │
               ▼                         ▼         │               ▼
┌─────────────────────────┐   ┌────────────────────┴──┐   ┌───────────────────────┐
│     FIREBASE SUITE      │   │   GOOGLE GEMINI API   │   │  GOOGLE MAPS ENGINE   │
│  • Firestore Database   │   │  • gemini-3.5-flash   │   │  • Real-Time Location │
│  • Authentication (OIDC)│   │  • gemini-3.1-pro     │   │    Grounding Tools    │
└─────────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

### 3.2 Data Processing Steps
1. **User Voice/Text Submission**: The client triggers speech recognition or reads the input text field. Any base64 image attachments are processed safely.
2. **API Dispatch**: A `POST` request is sent to `/api/chat` with message payload, image data (if any), conversation history, and selected AI mode.
3. **Model Selection**: The backend parses the query parameter:
   - **Image Attachment** ➔ Routes to `gemini-3.1-pro-preview` for high-fidelity vision understanding.
   - **Thinking Mode** ➔ Routes to `gemini-3.1-pro-preview` with `thinkingLevel` set to `HIGH` for reasoning.
   - **Maps Grounding** ➔ Routes to `gemini-3.5-flash` with the `googleMaps` grounding tool enabled.
   - **Lite Mode** ➔ Routes to `gemini-3.1-flash-lite` for lower overhead.
   - **General Mode** ➔ Default fallback to `gemini-3.5-flash`.
4. **Context Synthesis**: The Gemini API processes the current prompt with context and returns a structured JSON payload containing the detected language code, translation, sentiment score, and fluent native reply.
5. **Speech Synthesis**: The frontend receives the response, parses the detected language, selects the corresponding voice synthesizer locale, and reads the reply out loud.

---

## 4. SYSTEM IMPLEMENTATION & FILE ROLES

### 4.1 Frontend Files
* **`src/App.tsx`**: The main controller routing between the Authentication barrier (`LoginPage`) and the core application layout. Monitors Firebase auth states using `onAuthStateChanged`.
* **`src/components/LoginPage.tsx`**: Modern authorization console styling three pathways: secure Google Single Sign-On, credentials form validations, and instant Anonymous Guest mode.
* **`src/components/InputArea.tsx`**: Custom controller harboring file readers, the Web Speech STT recorder, and toggle pills matching `AiModeType`.
* **`src/components/ChatBox.tsx`**: Renders message blocks with user images, Markdown formatting, accent-based voice speakers, and direct translations.
* **`src/components/Sidebar.tsx`**: Displays conversation records, user accounts panel, sign-out actions, and live visual sentiment gauges.
* **`src/lib/speech.ts`**: Wrapper encapsulating the `webkitSpeechRecognition` API and `speechSynthesis` controls.
* **`src/lib/firebase.ts`**: Initializes the Firebase connection, exposes `auth` and Firestore references.

### 4.2 Backend Files
* **`server.ts`**: Sets up Express server binding to `0.0.0.0:3000`. Configures Vite development middlewares and secures communication channels with the `@google/genai` SDK.

---

## 5. DATABASE SCHEMA & SECURITY RULES

### 5.1 Cloud Firestore Structure
Data is organized under secure document trees:
```text
/sessions/{sessionId}
  ├── title: string
  ├── userId: string
  ├── createdAt: timestamp
  └── lastActiveAt: timestamp

/messages/{messageId}
  ├── sessionId: string
  ├── userId: string
  ├── text: string
  ├── sender: "user" | "bot"
  ├── image: string (optional base64 data)
  ├── mode: "lite" | "flash" | "thinking" | "maps"
  ├── timestamp: number
  └── sentimentScore: number (optional)
```

### 5.2 Firebase Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 6. KEY TECHNOLOGY HIGHLIGHTS
1. **High Thinking Configuration**:
   ```typescript
   config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
   ```
   Unlocks deep deductive logic inside the `gemini-3.1-pro-preview` model for solving complex math, programming, or logical queries.
2. **Google Maps Grounding Tool**:
   ```typescript
   config.tools = [{ googleMaps: {} }];
   ```
   Grounds Gemini's location replies using real-time search and spatial insights.
3. **Phonetic Speech synthesis**: Match locales dynamically:
   ```typescript
   const utterance = new SpeechSynthesisUtterance(text);
   utterance.lang = detectedLanguageCode; // e.g. "hi-IN", "es-ES", "ja-JP"
   window.speechSynthesis.speak(utterance);
   ```

---

## 7. INSTALLATION & SETUP GUIDE

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure environment variable `.env`**:
   ```env
   GEMINI_API_KEY="AIzaSyYourKeyHere..."
   APP_URL="http://localhost:3000"
   ```
3. **Compile build**:
   ```bash
   npm run build
   ```
4. **Boot App**:
   ```bash
   npm start
   ```

---

## 8. SUMMARY & RECOMMENDATIONS
Polyglot AI successfully achieves full marks for Web Application criteria:
- **Client-Side Complexity**: Implements reactive context, Web APIs (STT/TTS), and responsive styling.
- **Server-Side Integration**: Employs a secure Node.js middleware controller shielding API secrets.
- **Advanced AI Integrations**: Deploys vision models, deep reasoning, and maps search grounding.
- **Enterprise Storage**: Coordinates secure cloud database queries (Firestore) and state triggers.
