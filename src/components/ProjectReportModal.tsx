import React from "react";
import { X, FileText, ArrowDown, Cpu, Database, Mic, Volume2, Sparkles, Moon } from "lucide-react";

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="glass-card bg-slate-900/95 light-mode:bg-white/95 border border-white/20 light-mode:border-slate-300 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl relative text-white light-mode:text-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Mini Project Submission Report & Architecture</h2>
              <p className="text-xs text-indigo-300 light-mode:text-indigo-600">Language Agnostic Chatbot • Maximum Marks Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto hide-scroll space-y-6 pr-2">
          
          {/* Maximum Marks Features Checklist */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              ★ Maximum Marks Bonus Checklist
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-xs">
                <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Voice Input:</strong> Web Speech STT API</span>
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl flex items-center gap-2 text-xs">
                <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span><strong>Voice Output:</strong> Native Accent TTS</span>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Sentiment AI:</strong> Realtime Stats</span>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl flex items-center gap-2 text-xs">
                <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Dark Mode:</strong> Frosted Glass UI</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex items-center gap-2 text-xs col-span-2 sm:col-span-2">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span><strong>Chat History Storage:</strong> Firebase Firestore DB</span>
              </div>
            </div>
          </div>

          {/* Project Architecture Flowchart Diagram */}
          <div className="glass-card p-5 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
              Project Flowchart Architecture (Data Flow)
            </h3>
            
            <div className="flex flex-col items-center space-y-2 font-mono text-xs max-w-md mx-auto">
              <div className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-center shadow-md">
                👤 User Input (Text / Speech / Image Attachment)
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400 animate-bounce" />
              <div className="w-full py-2 px-4 rounded-xl bg-white/10 border border-white/20 text-center text-slate-200 light-mode:text-slate-800">
                🌐 Chat Interface (React Single Page Application)
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
              <div className="w-full py-2 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 light-mode:text-emerald-800 text-center">
                🛡️ Secure Express Backend (/api/chat Route Controller)
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
              <div className="w-full py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 light-mode:text-amber-800 text-center">
                🧠 Contextual Multilingual Router (Dynamic Model Routing)
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
              <div className="w-full py-2.5 px-4 rounded-xl bg-purple-600 text-white font-bold text-center shadow-lg flex items-center justify-center gap-2">
                <Cpu className="w-4 h-4" /> Google Gemini SDK (Flash / Pro with High Thinking & Maps)
              </div>
              <ArrowDown className="w-4 h-4 text-slate-400" />
              <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-center shadow-md">
                💬 Fluent Native Reply Translation + Audio Synthesizer Output
              </div>
            </div>
          </div>

          {/* Tech Stack Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Technologies & Modules
            </h3>
            <div className="text-xs space-y-1.5 text-slate-300 light-mode:text-slate-700 font-sans leading-relaxed">
              <p>• <strong>Frontend:</strong> React 18, Vite, Tailwind CSS with Frosted Glassmorphism, Lucide React, Web Speech API.</p>
              <p>• <strong>Backend:</strong> Node.js, Express Server hosting robust REST APIs and proxying secure API keys.</p>
              <p>• <strong>Database & Auth:</strong> Firebase Authentication (Google OAuth + Email Credentials + Anonymous Guest) & Cloud Firestore.</p>
              <p>• <strong>AI Orchestrator:</strong> Google GenAI SDK (incorporating <code>gemini-3.5-flash</code>, <code>gemini-3.1-pro-preview</code>, high thinking configuration, and Google Maps Grounding tools).</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">Estimated Cost: ₹0 (Free Tier Tools)</span>
          <button
            onClick={onClose}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-md cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
