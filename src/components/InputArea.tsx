import React, { useState, useRef } from "react";
import { Mic, MicOff, Send, Sparkles, Image, X, Zap, MapPin, Brain } from "lucide-react";
import { startSpeechRecognition } from "../lib/speech";
import { AiModeType } from "../types";

interface InputAreaProps {
  onSendMessage: (text: string, image?: string, mode?: AiModeType) => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [stopRecFn, setStopRecFn] = useState<(() => void) | null>(null);
  
  // AI Options state
  const [selectedMode, setSelectedMode] = useState<AiModeType>("flash");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus input on mount
  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if ((!inputText.trim() && !attachedImage) || isLoading) return;
    onSendMessage(inputText, attachedImage || undefined, selectedMode);
    setInputText("");
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            setVoiceError("Pasted image size must be smaller than 5MB.");
            continue;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setAttachedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  const toggleRecording = () => {
    setVoiceError(null);
    if (isRecording && stopRecFn) {
      stopRecFn();
      setIsRecording(false);
      setStopRecFn(null);
      return;
    }

    setIsRecording(true);
    const stopFn = startSpeechRecognition(
      (transcript) => {
        setInputText(transcript);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
      },
      (err) => {
        setVoiceError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
        setStopRecFn(null);
      }
    );

    setStopRecFn(() => stopFn);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setVoiceError("Image size must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear value to allow re-uploading same file
    e.target.value = "";
  };

  const removeImage = () => {
    setAttachedImage(null);
  };

  const modesConfig = [
    { id: "lite" as AiModeType, label: "Lite / Fast", icon: Zap, color: "text-amber-400 border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10" },
    { id: "flash" as AiModeType, label: "General", icon: Sparkles, color: "text-indigo-400 border-indigo-400/20 bg-indigo-400/5 hover:bg-indigo-400/10" },
    { id: "thinking" as AiModeType, label: "Thinking Mode", icon: Brain, color: "text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5 hover:bg-fuchsia-400/10" },
    { id: "maps" as AiModeType, label: "Maps Grounded", icon: MapPin, color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10" },
  ];

  return (
    <div className="flex flex-col gap-2.5 shrink-0 animate-fade-in">
      {voiceError && (
        <div className="bg-rose-500/20 text-rose-200 px-4 py-2 rounded-xl text-xs flex items-center justify-between border border-rose-500/30">
          <span>🎤 {voiceError}</span>
          <button onClick={() => setVoiceError(null)} className="font-bold hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {isRecording && (
        <div className="bg-indigo-500/20 text-indigo-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 border border-indigo-500/30 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>Listening in any language... Speak naturally into your microphone</span>
        </div>
      )}

      {/* Mode Selector Pill Buttons */}
      <div className="flex flex-wrap gap-1.5 px-1">
        {modesConfig.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                isSelected
                  ? "bg-white/15 border-white/30 text-white shadow-sm"
                  : `opacity-65 hover:opacity-100 ${mode.color}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Attached Image Thumbnail Preview & Quick Vision Presets */}
      {attachedImage && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 ml-2 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-fadeIn max-w-full">
          <div className="relative shrink-0">
            <img
              src={attachedImage}
              alt="Upload thumbnail"
              className="w-16 h-16 rounded-xl object-cover border border-white/20"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              📸 Gemini Vision Analysis Presets (Any Language)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "🔍 Describe Image", text: "Describe what is happening in this image in detail." },
                { label: "📝 Extract Text", text: "Extract and translate all text or handwriting found in this image." },
                { label: "🧮 Solve Equation", text: "Explain and solve any mathematical equations, questions, or charts shown here step-by-step." },
                { label: "💻 Analyze UI/Code", text: "Provide a comprehensive UI review or explain the code shown in this image." }
              ].map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(preset.text)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10.5px] font-medium transition-all active:scale-95 cursor-pointer border border-white/5 hover:border-indigo-500/40"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-2 sm:p-3 flex items-center gap-1.5 sm:gap-3 shadow-xl transition-all bg-white/5 border border-white/10 rounded-2xl">
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Image Attachment Button */}
        <button
          onClick={handleImageUploadClick}
          title="Upload image for Gemini analysis"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-all shrink-0 cursor-pointer"
        >
          <Image className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Voice Recording Button */}
        <button
          onClick={toggleRecording}
          title={isRecording ? "Stop Listening" : "Voice Input (Speech-to-Text)"}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            isRecording
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/50 scale-105 animate-pulse"
              : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-400" />}
        </button>

        <div className="relative flex-1 flex items-center min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={isLoading}
            className="w-full bg-white/5 light-mode:bg-white/60 border border-white/10 light-mode:border-slate-300 rounded-xl pl-3 pr-8 sm:pl-4 sm:pr-10 py-2 sm:py-2.5 text-white light-mode:text-slate-900 placeholder:text-slate-400 light-mode:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs sm:text-sm font-sans resize-none max-h-32 overflow-y-auto hide-scroll leading-relaxed"
            placeholder={isRecording ? "Listening..." : selectedMode === "maps" ? "Ask a location question (e.g., Best restaurants in Tokyo)..." : "Start typing in any language, or paste an image..."}
          />
          {inputText && (
            <button
              onClick={() => {
                setInputText("");
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.focus();
                }
              }}
              className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={(!inputText.trim() && !attachedImage) || isLoading}
          title="Send Message"
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all shrink-0 cursor-pointer ${
            (!inputText.trim() && !attachedImage) || isLoading
              ? "bg-indigo-500/40 cursor-not-allowed opacity-50"
              : "bg-indigo-500 hover:bg-indigo-600 active:scale-95 shadow-indigo-500/30"
          }`}
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
