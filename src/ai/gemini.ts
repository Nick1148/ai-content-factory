/**
 * Gemini API 연동 모듈
 * @google/generative-ai SDK를 사용하여 AI 콘텐츠를 생성합니다.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';

const MODEL_NAME = 'gemini-2.5-flash';

function getModel() {
  const apiKey = config.ai.geminiApiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { temperature: 0.7, maxOutputTokens: 16384 },
  });
}

async function callGemini(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error('Gemini API 응답에서 텍스트를 추출할 수 없습니다.');
  }
  return text.trim();
}

// JSON 모드: responseMimeType으로 유효한 JSON 강제 출력
async function callGeminiJson(prompt: string): Promise<string> {
  const apiKey = config.ai.geminiApiKey;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 16384,
      responseMimeType: 'application/json',
    },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error('Gemini API 응답에서 텍스트를 추출할 수 없습니다.');
  }
  return text.trim();
}

export { callGemini, callGeminiJson };
