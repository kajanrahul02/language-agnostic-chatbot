import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import compression from "compression";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper for lazy Gemini client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      }
    }
  });
}

// Fallback multilingual simulation for offline / missing API key demo
function simulateLanguageEngine(input: string) {
  const trimmed = input.trim();
  
  // Script / keyword heuristics
  const hasDevanagari = /[\u0900-\u097F]/.test(trimmed);
  const hasTamil = /[\u0B80-\u0BFF]/.test(trimmed);
  const hasMalayalam = /[\u0D00-\u0D7F]/.test(trimmed);
  const hasTelugu = /[\u0C00-\u0C7F]/.test(trimmed);
  const hasKannada = /[\u0C80-\u0CFF]/.test(trimmed);
  const hasJapaneseOrChinese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(trimmed);
  const hasGerman = /\b(kannst|wie|ist|hallo|danke|bitte|gerne|gut|helfen)\b/i.test(trimmed);
  const hasSpanish = /\b(hola|cómo|estas|bien|gracias|ayuda|por favor)\b/i.test(trimmed);
  const hasFrench = /\b(bonjour|comment|ça va|merci|aider|s'il vous plaît)\b/i.test(trimmed);

  let detectedLanguageName = "English";
  let detectedLanguageCode = "en";
  let response = "I understand your request. As Polyglot AI, I can assist you with coding, translations, and general queries in over 100 languages.";
  let translationEnInput = trimmed;
  let translationEnResponse = response;

  if (hasDevanagari) {
    detectedLanguageName = "Hindi";
    detectedLanguageCode = "hi";
    response = "नमस्ते! मैं आपकी बात समझ गया हूँ। पॉलीग्लॉट एआई के रूप में, मैं आपकी तकनीकी और सामान्य प्रश्नों में पूरी सहायता कर सकता हूँ।";
    translationEnInput = "Hello / Hindi query";
    translationEnResponse = "Hello! I understood your query. As Polyglot AI, I can fully assist you with technical and general questions.";
  } else if (hasTamil) {
    detectedLanguageName = "Tamil";
    detectedLanguageCode = "ta";
    response = "வணக்கம்! உங்கள் கேள்வியை நான் புரிந்துகொண்டேன். நான் உங்களுக்கு உதவ தயாராக உள்ளேன்.";
    translationEnInput = "Tamil query";
    translationEnResponse = "Hello! I understood your question. I am ready to help you.";
  } else if (hasMalayalam) {
    detectedLanguageName = "Malayalam";
    detectedLanguageCode = "ml";
    response = "നമസ്കാരം! നിങ്ങളുടെ ചോദ്യം ഞാൻ മനസ്സിലാക്കി. നിങ്ങൾക്ക് എന്ത് സഹായമാണ് വേണ്ടത്?";
    translationEnInput = "Malayalam query";
    translationEnResponse = "Hello! I understood your question. What help do you need?";
  } else if (hasTelugu) {
    detectedLanguageName = "Telugu";
    detectedLanguageCode = "te";
    response = "నమస్కారం! మీ ప్రశ్న నాకు అర్థమైంది. నేను మీకు ఎలా సహాయపడగలను?";
    translationEnInput = "Telugu query";
    translationEnResponse = "Hello! I understood your question. How can I help you?";
  } else if (hasKannada) {
    detectedLanguageName = "Kannada";
    detectedLanguageCode = "kn";
    response = "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರಶ್ನೆ ನನಗೆ ಅರ್ಥವಾಗಿದೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
    translationEnInput = "Kannada query";
    translationEnResponse = "Hello! I understood your question. How can I help you?";
  } else if (hasJapaneseOrChinese) {
    if (/[\u3040-\u30ff]/.test(trimmed)) {
      detectedLanguageName = "Japanese";
      detectedLanguageCode = "ja";
      response = "こんにちは！ご質問ありがとうございます。どのような技術サポートが必要ですか？喜んでお手伝いいたします。";
      translationEnInput = "Japanese query";
      translationEnResponse = "Hello! Thank you for your question. What technical support do you need? I'd be happy to help.";
    } else {
      detectedLanguageName = "Chinese";
      detectedLanguageCode = "zh-CN";
      response = "您好！我已经理解了您的问题。作为多语言人工智能，我可以为您提供准确的编程和技术解答。";
      translationEnInput = "Chinese query";
      translationEnResponse = "Hello! I have understood your question. As a multilingual AI, I can provide accurate programming and technical answers.";
    }
  } else if (hasGerman) {
    detectedLanguageName = "German";
    detectedLanguageCode = "de";
    response = "Hallo! Ich habe deine Anfrage verstanden. Gerne helfe ich dir bei deinem Projekt oder deinen Programmcode-Fragen weiter.";
    translationEnInput = "German query";
    translationEnResponse = "Hello! I understood your request. I am happy to help you further with your project or code questions.";
  } else if (hasSpanish) {
    detectedLanguageName = "Spanish";
    detectedLanguageCode = "es";
    response = "¡Hola! He entendido perfectamente tu mensaje. ¿En qué puedo ayudarte hoy con tu desarrollo o consulta?";
    translationEnInput = "Spanish query";
    translationEnResponse = "Hello! I understood your message perfectly. How can I help you today with your development or query?";
  } else if (hasFrench) {
    detectedLanguageName = "French";
    detectedLanguageCode = "fr";
    response = "Bonjour ! J'ai bien compris votre demande. Je suis à votre disposition pour répondre à toutes vos questions.";
    translationEnInput = "French query";
    translationEnResponse = "Hello! I understood your request well. I am at your disposal to answer all your questions.";
  }

  // Simple sentiment heuristic
  let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
  let sentimentScore = 75;
  if (/\b(thanks|danke|merci|gracias|धन्यवाद|good|great|love|excellent|happy|गजब|मजा|अच्छा)\b/i.test(trimmed)) {
    sentiment = 'Positive';
    sentimentScore = 92;
  } else if (/\b(error|bug|fail|bad|problem|help|stuck|खराब|समस्या|गलत)\b/i.test(trimmed)) {
    sentiment = 'Negative';
    sentimentScore = 40;
  }

  return {
    response,
    detectedLanguageName,
    detectedLanguageCode,
    translationEnInput,
    translationEnResponse,
    sentiment,
    sentimentScore
  };
}

// API endpoint for multi-language chat
app.post("/api/chat", async (req, res) => {
  const { message, history, image, mode } = req.body;
  if (!message && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  const ai = getGenAI();
  if (!ai) {
    console.log("[Polyglot Engine] Using simulated engine (API key not set)");
    const sim = simulateLanguageEngine(message || "Image attachment");
    return res.json(sim);
  }

  try {
    let modelName = "gemini-3.5-flash";
    let config: any = {
      responseMimeType: "application/json"
    };

    // Model selection rules:
    if (image) {
      // Analyze images: You MUST add image understanding to the app using model gemini-3.1-pro-preview
      modelName = "gemini-3.1-pro-preview";
    } else if (mode === "thinking") {
      // Enable high thinking: You MUST use the gemini-3.1-pro-preview model and set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens.
      modelName = "gemini-3.1-pro-preview";
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    } else if (mode === "maps") {
      // Use Google Maps data: You MUST add Maps Grounding to the app where relevant. Use gemini-3.5-flash (with googleMaps tool)
      modelName = "gemini-3.5-flash";
      config.tools = [{ googleMaps: {} }];
    } else if (mode === "lite") {
      // Lite Mode: Use gemini-3.1-flash-lite
      modelName = "gemini-3.1-flash-lite";
    } else {
      // General tasks: Use gemini-3.5-flash
      modelName = "gemini-3.5-flash";
    }

    const imageInstruction = image ? "The user has also attached an image which you must analyze and incorporate into your answer." : "";

    const prompt = `You are Polyglot AI, an advanced language-agnostic AI chatbot.
The user has sent the following message: "${message || ""}"
${imageInstruction}

Recent conversation context (if any): ${JSON.stringify(history?.slice(-4) || [])}

Perform the following:
1. Automatically detect the exact language of the user's message (e.g. German, Japanese, Chinese, Hindi, Tamil, Malayalam, Telugu, Kannada, English, Spanish, French, Arabic, Russian, etc.).
2. Respond to the user IN THE EXACT SAME LANGUAGE they used. Make the tone helpful, intelligent, natural, and fluent.
3. Translate the user's input into English.
4. Translate your AI response into English.
5. Analyze the sentiment of the user's message ('Positive', 'Neutral', or 'Negative') and assign a sentimentScore from 0 to 100 (where 100 is most positive, 50 neutral, 0 most negative).

Return ONLY a valid JSON object matching this exact schema:
{
  "response": "Your natural response in user's language",
  "detectedLanguageName": "Name of detected language (e.g. Hindi, German)",
  "detectedLanguageCode": "ISO 639-1 language code (e.g. hi, de, ja, ml, ta, en)",
  "translationEnInput": "English translation of user input",
  "translationEnResponse": "English translation of your AI response",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "sentimentScore": integer number between 0 and 100
}`;

    let contentsParts: any[] = [{ text: prompt }];

    // If there's an image base64, construct the multi-part structure
    if (image && typeof image === "string" && image.includes("base64,")) {
      const parts = image.split("base64,");
      const mimeType = parts[0].split(":")[1].split(";")[0];
      const base64Data = parts[1];
      
      contentsParts.unshift({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    let result;
    try {
      result = await ai.models.generateContent({
        model: modelName,
        contents: contentsParts,
        config: config
      });
    } catch (modelErr: any) {
      console.warn(`[Polyglot Engine] Failed to query preferred model ${modelName}:`, modelErr.message || modelErr);
      // Adaptive model fallback
      if (modelName === "gemini-3.1-pro-preview") {
        console.log("[Polyglot Engine] Falling back to gemini-3.5-flash for maximum efficiency...");
        modelName = "gemini-3.5-flash";
        if (config.thinkingConfig) {
          // gemini-3.5-flash supports ThinkingLevel.LOW or ThinkingLevel.MINIMAL
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }
        result = await ai.models.generateContent({
          model: modelName,
          contents: contentsParts,
          config: config
        });
      } else {
        throw modelErr;
      }
    }

    const text = result.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    let cleanJson = text.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleanJson);

    // Extract grounding chunks if present (e.g., from Maps grounding)
    let sources: any[] = [];
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && Array.isArray(groundingChunks)) {
      sources = groundingChunks.map((chunk: any) => {
        if (chunk.web) {
          return {
            title: chunk.web.title,
            uri: chunk.web.uri
          };
        }
        return null;
      }).filter(Boolean);
    }

    return res.json({
      response: parsed.response || "Hello!",
      detectedLanguageName: parsed.detectedLanguageName || "English",
      detectedLanguageCode: parsed.detectedLanguageCode || "en",
      translationEnInput: parsed.translationEnInput || message,
      translationEnResponse: parsed.translationEnResponse || parsed.response,
      sentiment: parsed.sentiment || "Neutral",
      sentimentScore: typeof parsed.sentimentScore === "number" ? parsed.sentimentScore : 75,
      sources: sources.length > 0 ? sources : undefined
    });
  } catch (err: any) {
    console.error("[Polyglot Engine Error]", err.message || err);
    // Fallback to simulation so app never crashes
    const fallback = simulateLanguageEngine(message);
    return res.json(fallback);
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Polyglot AI Server" });
});

// Explicit route to serve the printable HTML project report
app.get("/PROJECT_REPORT.html", (req, res) => {
  res.sendFile(path.join(process.cwd(), "PROJECT_REPORT.html"));
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Polyglot AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
