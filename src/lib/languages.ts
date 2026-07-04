import { LanguageInfo } from "../types";

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", flag: "🇬🇧", greeting: "Hello! Type in any language and I will respond instantly.", sampleQuestion: "How does the multilingual engine work?" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", greeting: "नमस्ते! किसी भी भाषा में टाइप करें और मैं तुरंत जवाब दूंगा।", sampleQuestion: "नमस्ते, आप कैसे हैं?" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", greeting: "வணக்கம்! எந்த மொழியிலும் தட்டச்சு செய்யுங்கள், நான் உடனடியாக பதிலளிப்பேன்.", sampleQuestion: "நீங்கள் எப்படி இருக்கிறீர்கள்?" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", greeting: "നമസ്കാരം! ഏത് ഭാഷയിലും ടൈപ്പ് ചെയ്യുക, ഞാൻ ഉടൻ മറുപടി നൽകും.", sampleQuestion: "കേരളത്തിലെ പ്രധാന വിനോദസഞ്ചാര കേന്ദ്രങ്ങൾ ഏതാണ്?" },
  { code: "te", name: "Telugu", flag: "🇮🇳", greeting: "నమస్కారం! ఏ భాషలోనైనా టైప్ చేయండి, నేను వెంటనే స్పందిస్తాను.", sampleQuestion: "మీరు ఎలా ఉన్నారు?" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", greeting: "ನಮಸ್ಕಾರ! ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ, ನಾನು ತಕ್ಷಣ ಉತ್ತರಿಸುತ್ತೇನೆ.", sampleQuestion: "ಬೆಂಗಳೂರಿನ ಹವಾಮಾನ ಹೇಗಿದೆ?" },
  { code: "de", name: "German", flag: "🇩🇪", greeting: "Hallo! Tippe in einer beliebigen Sprache und ich antworte sofort.", sampleQuestion: "Kannst du mir bei einer Python-Funktion helfen?" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", greeting: "こんにちは！どの言語で入力しても、即座に返信します。", sampleQuestion: "日本の東京で一番美味しいラーメン屋はどこですか？" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳", greeting: "您好！输入任何语言，我都会立即回复。", sampleQuestion: "人工智能的未来发展趋势是什么？" },
  { code: "es", name: "Spanish", flag: "🇪🇸", greeting: "¡Hola! Escribe en cualquier idioma y responderé al instante.", sampleQuestion: "¿Cuáles son los mejores lugares para visitar en España?" },
  { code: "fr", name: "French", flag: "🇫🇷", greeting: "Bonjour ! Tapez dans n'importe quelle langue et je répondrai instantanément.", sampleQuestion: "Comment apprendre le français rapidement ?" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", greeting: "مرحباً! اكتب بأي لغة وسأرد عليك فوراً.", sampleQuestion: "كيف يمكنني تطوير مهاراتي في البرمجة؟" },
  { code: "ru", name: "Russian", flag: "🇷🇺", greeting: "Привет! Пишите на любом языке, и я отвечу мгновенно.", sampleQuestion: "Расскажи о квантовых компьютерах." },
  { code: "ko", name: "Korean", flag: "🇰🇷", greeting: "안녕하세요! 어느 언어로 입력하든 즉시 답변해 드립니다.", sampleQuestion: "한국で人気のある観光地はどこですか？" },
  { code: "bn", name: "Bengali", flag: "🇮🇳", greeting: "নমস্কার! যেকোনো ভাষায় লিখুন, আমি সাথে সাথে উত্তর দেব।", sampleQuestion: "রবীন্দ্রনাথ ঠাকুর সম্পর্কে কিছু বলুন।" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", greeting: "آداب! کسی بھی زبان میں لکھیں، میں فوراً جواب دوں گا۔", sampleQuestion: "اردو ادب کا سنہری دور کونسا تھا؟" },
  { code: "it", name: "Italian", flag: "🇮🇹", greeting: "Ciao! Scrivi in qualsiasi lingua e risponderò all'istante.", sampleQuestion: "Qual è la ricetta della vera carbonara?" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", greeting: "Olá! Digite em qualquer idioma e responderei instantaneamente.", sampleQuestion: "Quais são as melhores praias de Portugal?" }
];

export const SAMPLE_SESSIONS = [
  { flag: "🇬🇧", title: "Travel Inquiry", lang: "English", query: "Can you recommend a 3-day itinerary for London?" },
  { flag: "🇯🇵", title: "ビジネスメール", lang: "Japanese", query: "取引先に送る丁寧に御礼を伝えるメールの文面を作成してください。" },
  { flag: "🇩🇪", title: "Urlaubsplanung", lang: "German", query: "Was sind die besten Reisetipps für die Alpen im Sommer?" },
  { flag: "🇮🇳", title: "तकनीकी सहायता", lang: "Hindi", query: "पायथन में डिक्शनरी और लिस्ट में क्या मुख्य अंतर है?" },
  { flag: "🇮🇳", title: "മലയാളം സംഭാഷണം", lang: "Malayalam", query: "കേരളീയ സംസ്കാരത്തിന്റെ പ്രത്യേകതകൾ എന്തൊക്കെയാണ്?" },
  { flag: "🇮🇳", title: "ತಂತ್ರಜ್ಞಾನ ಪ್ರಶ್ನೆ", lang: "Kannada", query: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ನಮ್ಮ ಭವಿಷ್ಯವನ್ನು ಹೇಗೆ ಬದಲಾಯಿಸುತ್ತದೆ?" }
];
