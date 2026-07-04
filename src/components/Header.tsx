import React from "react";
import { Sparkles, RefreshCw, Info, Menu } from "lucide-react";

interface HeaderProps {
  detectedLangCode?: string;
  detectedLangName?: string;
  onClearChat: () => void;
  onOpenInfo: () => void;
  isLoading: boolean;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  detectedLangCode = "en",
  detectedLangName = "English",
  onClearChat,
  onOpenInfo,
  isLoading,
  onToggleSidebar,
}) => {
  return (
    <header className="glass-card px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg shrink-0 transition-all">
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap flex-1 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <span className="text-xs text-indigo-300 dark:text-indigo-300 light-mode:text-indigo-600 font-bold uppercase tracking-wider">
            Current Focus
          </span>
          <span className="text-white dark:text-white light-mode:text-slate-900 font-semibold flex items-center gap-2 text-sm sm:text-base">
            <span className="truncate">Multilingual Context Engine</span>
            {detectedLangName && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 shrink-0">
                Active: {detectedLangName} ({detectedLangCode})
              </span>
            )}
          </span>
        </div>
        <div className="hidden md:block h-8 w-px bg-white/10 mx-2"></div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-amber-400 animate-bounce' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span className="text-xs sm:text-sm text-slate-300 light-mode:text-slate-700 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{isLoading ? "Translating & Processing..." : "Gemini Pro Active"}</span>
            <span className="sm:hidden">{isLoading ? "Processing..." : "Gemini Pro"}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Avatars Cluster */}
        <div className="hidden sm:flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 light-mode:border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-medium shadow-sm">
            En
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 light-mode:border-white bg-emerald-600 flex items-center justify-center text-[10px] text-white font-medium shadow-sm">
            Hi
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 light-mode:border-white bg-rose-600 flex items-center justify-center text-[10px] text-white font-medium shadow-sm">
            De
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 light-mode:border-white bg-amber-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
            +92
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <button
            onClick={onClearChat}
            title="Clear Conversation"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 light-mode:text-slate-700 transition-all active:scale-95 border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onOpenInfo}
            title="Project Information"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 light-mode:text-slate-700 transition-all active:scale-95 border border-white/10"
          >
            <Info className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
