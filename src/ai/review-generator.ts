/**
 * AI 리뷰 생성 모듈
 * Gemini API를 활용하여 수집된 도구에 대한 상세 리뷰를 생성합니다.
 */

import { callGemini } from './gemini.js';
import type { CollectedTool } from '../collectors/types.js';
import type { GeneratedReview } from '../content/types.js';

export async function generateReview(tool: CollectedTool): Promise<GeneratedReview> {
  const prompt = `당신은 AI 도구 전문 리뷰어입니다. 다음 도구에 대해 한국어로 상세 리뷰를 작성해주세요.

## 도구 정보
- 이름: ${tool.name}
- 태그라인: ${tool.tagline}
- 설명: ${tool.description}
- URL: ${tool.url}
- 투표 수: ${tool.votes}
- GitHub 스타: ${tool.stars}
- GitHub 포크: ${tool.forks}
- 언어: ${tool.language || '미정'}
- 토픽: ${tool.topics.join(', ')}
- 출처: ${tool.source}

## 응답 형식 (반드시 아래 JSON 형식으로만 응답하세요)

\`\`\`json
{
  "title": "매력적인 리뷰 제목 (한국어)",
  "summary": "도구에 대한 2~3문장 요약 (한국어)",
  "pros": ["장점1", "장점2", "장점3", "장점4"],
  "cons": ["단점1", "단점2", "단점3"],
  "useCases": ["활용 사례1", "활용 사례2", "활용 사례3"],
  "alternatives": ["대안 도구1", "대안 도구2"],
  "rating": 8.5,
  "content": "마크다운 형식의 전체 리뷰 글 (800~1500 단어, 한국어)"
}
\`\`\`

## content 작성 가이드
- 한국어로 작성
- 마크다운 형식 사용 (## 제목, **볼드**, - 리스트 등)
- 800~1500 단어 분량
- 구성: 도입 -> 핵심 기능 -> 장단점 분석 -> 활용 사례 -> 결론
- rating은 1.0~10.0 사이 소수점 한 자리까지

JSON만 출력하세요. JSON 외 다른 텍스트는 포함하지 마세요.`;

  try {
    const result = await callGemini(prompt);

    // JSON 블록 추출 (코드 블록 또는 순수 JSON)
    let jsonStr = result;
    const codeBlockMatch = result.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as GeneratedReview;

    // 필수 필드 검증 및 기본값 설정
    return {
      title: parsed.title || `${tool.name} 리뷰`,
      summary: parsed.summary || tool.tagline,
      pros: Array.isArray(parsed.pros) ? parsed.pros : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons : [],
      useCases: Array.isArray(parsed.useCases) ? parsed.useCases : [],
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : [],
      rating: typeof parsed.rating === 'number' ? Math.min(10, Math.max(1, parsed.rating)) : 7.0,
      content: parsed.content || parsed.summary || '',
    };
  } catch (error) {
    console.error(`[ReviewGenerator] 리뷰 생성 실패 (${tool.name}):`, error);

    // 폴백: 기본 리뷰 생성
    return {
      title: `${tool.name}: ${tool.tagline}`,
      summary: tool.description || tool.tagline,
      pros: ['활발한 커뮤니티 지원'],
      cons: ['추가 리뷰가 필요합니다'],
      useCases: ['AI 도구 활용'],
      alternatives: [],
      rating: 5.0,
      content: `## ${tool.name}\n\n${tool.description || tool.tagline}\n\n자세한 리뷰를 생성하지 못했습니다. 도구 페이지를 직접 방문해주세요: ${tool.url}`,
    };
  }
}
