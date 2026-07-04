import React from "react";
import { X, Globe, Languages, Sparkles, CheckCircle2 } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../lib/languages";

interface LanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguageSample: (sampleQ: string) => void;
}

export const LanguagesModal: React.FC<LanguagesModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguageSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-slate-900/90 light-mode:bg-white/95 border border-white/20 light-mode:border-slate-300 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative text-white light-mode:text-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Supported Languages & Dialects</h2>
              <p className="text-xs text-slate-400">Powered by langdetect & deep-translator middleware</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation Banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-5 text-xs leading-relaxed text-indigo-200 light-mode:text-indigo-900">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Language-Agnostic Architecture
          </p>
          You do <strong>not</strong> need to manually select a dropdown! Type in any regional script or tongue. The system normalizes input to English for Gemini Pro LLM logic, then maps responses back dynamically.
        </div>

        {/* Grid of Languages */}
        <div className="flex-1 overflow-y-auto hide-scroll pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                onClick={() => {
                  onSelectLanguageSample(lang.sampleQuestion);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/15 light-mode:bg-slate-100 light-mode:hover:bg-indigo-50 border border-white/5 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-semibold truncate text-white light-mode:text-slate-900 group-hover:text-indigo-400">
                    {lang.name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 italic font-sans">
                  "{lang.greeting.slice(0, 24)}..."
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            + Over 85 additional international and regional dialects automatically supported!
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
