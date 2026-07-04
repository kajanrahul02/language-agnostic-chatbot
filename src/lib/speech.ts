/**
 * Web Speech API wrappers for Polyglot AI
 */

const LANG_VOICE_MAP: Record<string, string> = {
  hi: "hi-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  te: "te-IN",
  kn: "kn-IN",
  bn: "bn-IN",
  ur: "ur-PK",
  de: "de-DE",
  ja: "ja-JP",
  "zh-cn": "zh-CN",
  zh: "zh-CN",
  es: "es-ES",
  fr: "fr-FR",
  ar: "ar-SA",
  ru: "ru-RU",
  ko: "ko-KR",
  it: "it-IT",
  pt: "pt-BR",
  en: "en-US",
};

export function speakText(text: string, langCode: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this browser environment.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const normalized = langCode.toLowerCase().trim();
  utterance.lang = LANG_VOICE_MAP[normalized] || langCode || "en-US";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  // Try to pick a native voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(normalized));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Global recognition instance for cleanup
let activeRecognition: any = null;

export function startSpeechRecognition(
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("Voice recognition is not supported in this browser. Please try Chrome or Edge.");
    onEnd();
    return () => {};
  }

  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch (e) {}
  }

  const recognition = new SpeechRecognition();
  recognition.lang = window.navigator.language || "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;

  let finalTranscript = "";

  recognition.onresult = (event: any) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    onResult(finalTranscript || interim);
  };

  recognition.onerror = (event: any) => {
    if (event.error !== "no-speech") {
      onError(`Recognition error: ${event.error}`);
    }
  };

  recognition.onend = () => {
    activeRecognition = null;
    onEnd();
  };

  activeRecognition = recognition;
  recognition.start();

  return () => {
    try {
      recognition.stop();
    } catch (e) {}
  };
}
