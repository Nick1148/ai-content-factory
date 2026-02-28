/**
 * Gemini API 연동 모듈
 * @google/generative-ai SDK를 사용하여 카테고리 분류와 트렌드 점수를 산정합니다.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/index.js';
import type { CollectedTool } from '../collectors/types.js';
import type { ToolCategory } from '../content/types.js';

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

const VALID_CATEGORIES: ToolCategory[] = [
  'AI Agent',
  'Image Gen',
  'Code',
  'Productivity',
  'Data',
  'Other',
];

export async function categorize(tool: CollectedTool): Promise<ToolCategory> {
  const prompt = `다음 AI 도구의 카테고리를 분류해주세요.

도구 이름: ${tool.name}
설명: ${tool.description || tool.tagline}
토픽: ${tool.topics.join(', ')}
언어: ${tool.language || '없음'}

카테고리 목록 (반드시 아래 중 하나만 선택):
- AI Agent: 자율 에이전트, 워크플로우 자동화, 챗봇
- Image Gen: 이미지 생성, 편집, 비디오 생성
- Code: 코드 생성, IDE 플러그인, 개발자 도구
- Productivity: 생산성, 문서 작성, 노트, 프로젝트 관리
- Data: 데이터 분석, ML 파이프라인, 데이터 시각화
- Other: 위 카테고리에 해당하지 않는 도구

카테고리 이름만 정확히 출력하세요. 설명 없이 카테고리 이름만 답변하세요.`;

  try {
    const result = await callGemini(prompt);
    const cleaned = result.replace(/['"]/g, '').trim();
    const matched = VALID_CATEGORIES.find(
      (c) => c.toLowerCase() === cleaned.toLowerCase()
    );
    return matched ?? 'Other';
  } catch (error) {
    console.error(`[Gemini] 카테고리 분류 실패 (${tool.name}):`, error);
    return 'Other';
  }
}

export async function scoreTrend(tool: CollectedTool): Promise<number> {
  const prompt = `다음 AI 도구의 트렌드 점수를 1에서 100 사이로 매겨주세요.

도구 이름: ${tool.name}
설명: ${tool.description || tool.tagline}
투표 수: ${tool.votes}
GitHub 스타: ${tool.stars}
GitHub 포크: ${tool.forks}
토픽: ${tool.topics.join(', ')}
출처: ${tool.source}

평가 기준:
- 투표/스타 수가 높을수록 높은 점수
- AI 관련 트렌드와의 연관성
- 커뮤니티 관심도 (포크, 토픽 수)
- 도구의 혁신성과 유용성

숫자만 출력하세요. 설명 없이 1~100 사이의 정수만 답변하세요.`;

  try {
    const result = await callGemini(prompt);
    const score = parseInt(result.replace(/[^0-9]/g, ''), 10);
    if (isNaN(score) || score < 1 || score > 100) {
      return 50;
    }
    return score;
  } catch (error) {
    console.error(`[Gemini] 트렌드 점수 산정 실패 (${tool.name}):`, error);
    return 50;
  }
}

export { callGemini, callGeminiJson };
