import React, { useRef, useEffect, useState } from "react";
import { Volume2, Sparkles, Languages, ChevronDown, ChevronUp, Bot, User } from "lucide-react";
import { ChatMessage } from "../types";
import { speakText } from "../lib/speech";

const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const renderMessageWithLinks = (text: string) => {
  if (!text) return null;

  // Unified Regex for matching both markdown links [label](url) and pure URLs starting with http://, https://, or www.
  const unifiedRegex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+|[^\s)]+\.[a-zA-Z]{2,}[^\s)]*)\))|(https?:\/\/[^\s<>\(\)]+|www\.[^\s<>\(\)]+)/gi;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  let match;
  while ((match = unifiedRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Add plain text preceding the match
    if (matchIndex > lastIndex) {
      elements.push(<React.Fragment key={`txt-${key++}`}>{text.substring(lastIndex, matchIndex)}</React.Fragment>);
    }

    if (match[1]) {
      // It is a Markdown Link: [label](url)
      const label = match[2];
      const rawUrl = match[3];
      const absoluteUrl = ensureAbsoluteUrl(rawUrl);

      elements.push(
        <a
          key={`lnk-${key++}`}
          href={absoluteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 light-mode:text-indigo-600 hover:underline font-semibold inline-flex items-center gap-0.5 break-all cursor-pointer decoration-2"
        >
          {label}
          <span className="text-[10px] opacity-85">↗</span>
        </a>
      );
    } else if (match[4]) {
      // It is a Pure URL Link
      const rawUrl = match[4];
      const absoluteUrl = ensureAbsoluteUrl(rawUrl);

      elements.push(
        <a
          key={`url-${key++}`}
          href={absoluteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 light-mode:text-indigo-600 hover:underline font-semibold inline-flex items-center gap-0.5 break-all cursor-pointer decoration-2"
        >
          {rawUrl}
          <span className="text-[10px] opacity-85">↗</span>
        </a>
      );
    }

    lastIndex = unifiedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(<React.Fragment key={`txt-${key++}`}>{text.substring(lastIndex)}</React.Fragment>);
  }

  return elements.length > 0 ? elements : text;
};

interface ChatBoxProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTranslation = (id: string) => {
    setShowTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSpeak = (id: string, text: string, langCode: string) => {
    if (playingId === id) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingId(null);
    } else {
      setPlayingId(id);
      speakText(text, langCode, () => {
        setPlayingId(null);
      });
    }
  };

  return (
    <section className="flex-1 glass-card p-6 overflow-hidden flex flex-col shadow-2xl relative transition-all">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scroll flex flex-col space-y-4 pr-2 pb-2"
      >
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          const isTranslated = !!msg.translationEn && msg.translationEn !== msg.text;

          return (
            <div
              key={msg.id}
              className={`message-bubble flex flex-col transition-all ${
                isBot ? "bot-msg self-start" : "user-msg self-end"
              }`}
            >
              {/* Metadata Banner for Bot */}
              {isBot && msg.detectedLanguageName && (
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5 text-[11px]">
                  <span className="opacity-60 flex items-center gap-1.5 font-mono text-indigo-300 light-mode:text-indigo-600">
                    <Languages className="w-3.5 h-3.5" />
                    Detected: {msg.detectedLanguageName} ({msg.detectedLanguageCode || "auto"})
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {isTranslated && (
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className="opacity-70 hover:opacity-100 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-all"
                      >
                        {showTranslations[msg.id] ? "Hide EN" : "Show EN Bridge"}
                        {showTranslations[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text, msg.detectedLanguageCode || "en")}
                      title={playingId === msg.id ? "Stop Listening" : `Listen in ${msg.detectedLanguageName}`}
                      className={`opacity-90 hover:opacity-100 flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-1 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer border ${
                        playingId === msg.id
                          ? "bg-emerald-500/25 text-emerald-300 border-emerald-500/40 animate-pulse"
                          : "bg-white/10 hover:bg-white/15 text-slate-300 border-white/5"
                      }`}
                    >
                      <Volume2 className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${playingId === msg.id ? "animate-bounce" : "text-indigo-400"}`} />
                      <span className="font-semibold">{playingId === msg.id ? "Speaking" : "Listen"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Message Text */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-100 light-mode:text-slate-900">
                {msg.image && (
                  <div className="mb-2">
                    <img
                      src={msg.image}
                      alt="Uploaded attachment"
                      className="max-w-full sm:max-w-xs max-h-48 sm:max-h-64 rounded-xl object-contain border border-white/10 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                {renderMessageWithLinks(msg.text)}
              </div>

              {/* Grounding Sources (Google Maps or Search references) */}
              {isBot && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col gap-1.5 animate-fadeIn">
                  <div className="text-[10px] uppercase font-bold text-indigo-300 light-mode:text-indigo-600 tracking-wider flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    Verified Location & Search Sources
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, index) => {
                      const absoluteUri = ensureAbsoluteUrl(src.uri);
                      return (
                        <a
                          key={index}
                          href={absoluteUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 light-mode:text-indigo-700 light-mode:bg-indigo-500/5 light-mode:hover:bg-indigo-500/15 border border-indigo-500/20 transition-all active:scale-95 cursor-pointer max-w-full truncate font-mono"
                          title={src.title}
                        >
                          <span className="truncate max-w-[180px] sm:max-w-[240px]">{src.title || "Source"}</span>
                          <span className="text-[9px] opacity-60">↗</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Translation Bridge Dropdown */}
              {isBot && isTranslated && showTranslations[msg.id] && (
                <div className="mt-3 pt-2.5 border-t border-white/10 bg-black/20 light-mode:bg-slate-100 p-3 rounded-xl text-xs font-mono text-indigo-200 light-mode:text-indigo-800 animate-fadeIn">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" /> Internal Gemini Reasoning (English Bridge)
                  </div>
                  "{msg.translationEn}"
                </div>
              )}

              {/* Timestamp & Sentiment Badge */}
              <div className={`text-[10px] mt-2 flex items-center justify-end gap-2 opacity-50 ${isBot ? 'text-slate-400' : 'text-indigo-100'}`}>
                {msg.sentiment && isBot && (
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/10">
                    Sentiment: {msg.sentiment} ({msg.sentimentScore}%)
                  </span>
                )}
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="message-bubble bot-msg self-start animate-pulse flex items-center gap-3 py-3 px-4">
            <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
            <div className="flex space-x-1.5 items-center">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.2s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.4s]"></div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Polyglot Engine Detecting & Translating...</span>
          </div>
        )}
      </div>
    </section>
  );
};
