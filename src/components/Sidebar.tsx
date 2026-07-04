import React from "react";
import { Globe, Moon, Sun, Plus, History, Sparkles, Languages, FileText, LogOut, User as UserIcon, X } from "lucide-react";
import { SAMPLE_SESSIONS } from "../lib/languages";

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewChat: () => void;
  onSelectSample: (query: string, title: string, flag: string) => void;
  currentSentiment: 'Positive' | 'Neutral' | 'Negative';
  currentSentimentScore: number;
  onOpenLanguagesModal: () => void;
  onOpenReportModal: () => void;
  activeSessionTitle: string;
  currentUser?: any;
  onSignOut?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  onToggleDarkMode,
  onNewChat,
  onSelectSample,
  currentSentiment,
  currentSentimentScore,
  onOpenLanguagesModal,
  onOpenReportModal,
  activeSessionTitle,
  currentUser,
  onSignOut,
  isOpen = false,
  onClose,
}) => {
  const getSentimentColor = () => {
    if (currentSentiment === 'Positive') return 'text-emerald-400 bg-emerald-400';
    if (currentSentiment === 'Negative') return 'text-rose-400 bg-rose-400';
    return 'text-amber-400 bg-amber-400';
  };

  const sentimentColorClasses = getSentimentColor();

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fadeIn cursor-pointer"
        />
      )}

      <aside
        className={`fixed inset-y-2 left-2 z-50 w-72 glass-card flex flex-col p-5 text-slate-200 overflow-hidden shadow-2xl transition-all duration-300 ease-in-out md:relative md:inset-0 md:flex ${
          isOpen ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6 px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-white dark:text-white light-mode:text-slate-900">
                Polyglot AI
              </h1>
              <span className="text-[10px] text-indigo-300 font-mono">v2.5 Agnostic</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Chat & Actions Bar */}
        <div className="grid grid-cols-2 gap-2 mb-6 px-1 shrink-0">
          <button
            onClick={() => {
              onNewChat();
              if (onClose) onClose();
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
          <button
            onClick={() => {
              onOpenLanguagesModal();
              if (onClose) onClose();
            }}
            className="bg-white/10 hover:bg-white/20 text-slate-200 light-mode:text-slate-800 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-white/10"
          >
            <Languages className="w-4 h-4 text-indigo-400" /> 100+ Langs
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto hide-scroll">
          {/* Active Sessions / Samples */}
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 light-mode:text-slate-500">
                Active Sessions
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                Click to Test
              </span>
            </div>
            <div className="space-y-1.5 px-1">
              {SAMPLE_SESSIONS.map((session, idx) => {
                const isActive = activeSessionTitle === session.title;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onSelectSample(session.query, session.title, session.flag);
                      if (onClose) onClose();
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                      isActive
                        ? "bg-white/20 border-indigo-400/50 shadow-md translate-x-1"
                        : "bg-white/5 border-transparent opacity-75 hover:opacity-100 hover:bg-white/10 hover:translate-x-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-xl">{session.flag}</span>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate text-white light-mode:text-slate-900">
                          {session.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{session.lang}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Sentiment Stats */}
          <div className="px-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 light-mode:text-slate-500 mb-3 px-1">
              Live AI Stats
            </p>
            <div className="glass-card p-4 space-y-3 bg-white/5 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 light-mode:text-slate-600 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Sentiment
                </span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  currentSentiment === 'Positive' ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-400' :
                  currentSentiment === 'Negative' ? 'bg-rose-500/20 text-rose-300 dark:text-rose-400' :
                  'bg-amber-500/20 text-amber-300 dark:text-amber-400'
                }`}>
                  {currentSentiment} ({currentSentimentScore}%)
                </span>
              </div>
              <div className="w-full bg-white/10 light-mode:bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${sentimentColorClasses.split(' ')[1]}`}
                  style={{ width: `${currentSentimentScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Engine: langdetect</span>
                <span>Gemini 2.5 Flash</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Badge */}
        {currentUser && (
          <div className="mt-auto mb-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white light-mode:text-slate-900 truncate">
                  {currentUser.isAnonymous ? "Guest User" : (currentUser.displayName || currentUser.email?.split('@')[0] || "User")}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {currentUser.isAnonymous ? "Instant Access" : currentUser.email}
                </span>
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Footer Controls */}
        <div className={`pt-4 border-t border-white/10 flex items-center justify-between px-2 shrink-0 ${!currentUser ? 'mt-auto' : ''}`}>
          <button
            onClick={() => {
              onOpenReportModal();
              if (onClose) onClose();
            }}
            title="Project Report & Architecture"
            className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-white/5 flex items-center gap-1 text-xs font-medium"
          >
            <FileText className="w-4 h-4" /> Architecture
          </button>

          <button
            onClick={onToggleDarkMode}
            className="bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 text-white light-mode:text-slate-800 transition-all active:scale-95 border border-white/10 shadow-sm"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" /> Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" /> Dark
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
