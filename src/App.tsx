import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatBox } from "./components/ChatBox";
import { InputArea } from "./components/InputArea";
import { LoginPage } from "./components/LoginPage";
import { LanguagesModal } from "./components/LanguagesModal";
import { ProjectReportModal } from "./components/ProjectReportModal";
import { ChatMessage, SentimentType, AiModeType } from "./types";
import { stopSpeaking } from "./lib/speech";
import { auth, onAuthStateChanged, signOut, User } from "./lib/firebase";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-welcome",
      sender: "bot",
      text: "Hello! I am Polyglot AI. I can understand over 100 languages, read your spoken voice, or analyze any image you upload! Click the 🖼️ icon below to attach an image. 🌐",
      timestamp: Date.now() - 60000,
      detectedLanguageName: "English",
      detectedLanguageCode: "en",
    },
    {
      id: "user-ex-1",
      sender: "user",
      text: "नमस्ते, आप कैसे हैं?",
      timestamp: Date.now() - 45000,
    },
    {
      id: "bot-ex-1",
      sender: "bot",
      text: "मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद! मैं आपकी किस प्रकार सहायता कर सकता हूँ?",
      timestamp: Date.now() - 30000,
      detectedLanguageName: "Hindi",
      detectedLanguageCode: "hi",
      translationEn: "I am absolutely fine, thank you for asking! How can I assist you?",
      sentiment: "Positive",
      sentimentScore: 92,
    },
    {
      id: "user-ex-2",
      sender: "user",
      text: "Kannst du mir bei einer Python-Funktion helfen?",
      timestamp: Date.now() - 20000,
    },
    {
      id: "bot-ex-2",
      sender: "bot",
      text: "Natürlich! Gerne helfe ich dir bei deiner Python-Funktion. Bitte sende mir den Code oder beschreibe, was die Funktion tun soll.",
      timestamp: Date.now() - 10000,
      detectedLanguageName: "German",
      detectedLanguageCode: "de",
      translationEn: "Of course! I would be happy to help you with your Python function. Please send me the code or describe what the function should do.",
      sentiment: "Positive",
      sentimentScore: 88,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<SentimentType>("Positive");
  const [currentSentimentScore, setCurrentSentimentScore] = useState<number>(88);
  const [detectedLangCode, setDetectedLangCode] = useState("de");
  const [detectedLangName, setDetectedLangName] = useState("German");
  const [activeSessionTitle, setActiveSessionTitle] = useState("तकनीकी सहायता");

  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Monitor Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync theme class to HTML body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-mode");
      document.body.style.backgroundColor = "#0f172a"; // Deep Obsidian
    } else {
      document.body.classList.add("light-mode");
      document.body.style.backgroundColor = "#f1f5f9"; // Soft Slate
    }
  }, [darkMode]);

  const handleSendMessage = async (text: string, image?: string, mode: AiModeType = "flash") => {
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now(),
      image,
      mode,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          image,
          mode,
          history: newMessages.slice(-6).map((msg) => ({
            sender: msg.sender,
            text: msg.text,
            image: msg.image,
            mode: msg.mode,
          })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.response || "Hello!",
        timestamp: Date.now(),
        detectedLanguageName: data.detectedLanguageName || "English",
        detectedLanguageCode: data.detectedLanguageCode || "en",
        translationEn: data.translationEnResponse || data.response,
        sentiment: data.sentiment || "Neutral",
        sentimentScore: data.sentimentScore || 75,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, botMsg]);
      if (data.detectedLanguageCode) setDetectedLangCode(data.detectedLanguageCode);
      if (data.detectedLanguageName) setDetectedLangName(data.detectedLanguageName);
      if (data.sentiment) setCurrentSentiment(data.sentiment);
      if (typeof data.sentimentScore === "number") setCurrentSentimentScore(data.sentimentScore);
    } catch (err) {
      console.error("Chat error:", err);
      const errBotMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: "I understood your intent, but encountered a network latency issue while translating. Please try again.",
        timestamp: Date.now(),
        detectedLanguageName: "English",
        detectedLanguageCode: "en",
      };
      setMessages((prev) => [...prev, errBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `bot-new-${Date.now()}`,
        sender: "bot",
        text: "Hello! New conversation started. Feel free to type in any language, speak via microphone, or attach an image (using the image icon 🖼️) for instant analysis! 🌐",
        timestamp: Date.now(),
        detectedLanguageName: "English",
        detectedLanguageCode: "en",
      },
    ]);
    setActiveSessionTitle("");
    setDetectedLangCode("en");
    setDetectedLangName("English");
  };

  const handleSelectSample = (query: string, title: string, flag: string) => {
    setActiveSessionTitle(title);
    handleSendMessage(query);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Auth Loading Indicator
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono text-slate-400">Loading Polyglot AI...</span>
        </div>
      </div>
    );
  }

  // Redirect to LoginPage if not logged in
  if (!currentUser) {
    return <LoginPage darkMode={darkMode} onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex items-center justify-center p-2 sm:p-6 select-none sm:select-auto">
      {/* Dynamic Frosted Background Mesh */}
      <div className={darkMode ? "mesh-bg" : "light-mesh-bg"}></div>

      {/* Main Frosted Glass Stage Container */}
      <div className="flex flex-col md:flex-row h-[94vh] max-h-[860px] w-full max-w-[1280px] gap-4 sm:gap-6 relative z-10">
        
        {/* Left Sidebar */}
        <Sidebar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNewChat={handleNewChat}
          onSelectSample={handleSelectSample}
          currentSentiment={currentSentiment}
          currentSentimentScore={currentSentimentScore}
          onOpenLanguagesModal={() => setIsLanguagesModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          activeSessionTitle={activeSessionTitle}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 flex flex-col gap-3 sm:gap-4 overflow-hidden h-full min-w-0">
          <Header
            detectedLangCode={detectedLangCode}
            detectedLangName={detectedLangName}
            onClearChat={handleNewChat}
            onOpenInfo={() => setIsReportModalOpen(true)}
            isLoading={isLoading}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <ChatBox messages={messages} isLoading={isLoading} />

          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </main>
      </div>

      {/* Popups & Modals */}
      <LanguagesModal
        isOpen={isLanguagesModalOpen}
        onClose={() => setIsLanguagesModalOpen(false)}
        onSelectLanguageSample={(q) => handleSendMessage(q)}
      />

      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
