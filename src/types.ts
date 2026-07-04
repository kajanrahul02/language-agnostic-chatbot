export type SentimentType = 'Positive' | 'Neutral' | 'Negative';
export type AiModeType = 'flash' | 'thinking' | 'maps' | 'lite';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  detectedLanguageName?: string;
  detectedLanguageCode?: string;
  translationEn?: string;
  sentiment?: SentimentType;
  sentimentScore?: number;
  image?: string;
  mode?: AiModeType;
  sources?: Array<{ title: string; uri: string }>;
}

export interface ChatSession {
  id: string;
  title: string;
  flag: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface ApiResponse {
  response: string;
  detectedLanguageName: string;
  detectedLanguageCode: string;
  translationEnInput: string;
  translationEnResponse: string;
  sentiment: SentimentType;
  sentimentScore: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  sampleQuestion: string;
}
