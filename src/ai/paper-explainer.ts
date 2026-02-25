/**
 * AI 논문 한국어 해설 생성 모듈
 * Gemini API를 활용하여 arXiv 논문을 한국어로 쉽게 해설합니다.
 */

import { callGemini } from './gemini.js';
import type { ArxivPaper } from '../collectors/types.js';
import type { PaperExplanation } from '../content/types.js';

export async function generatePaperExplanation(paper: ArxivPaper): Promise<PaperExplanation> {
  const prompt = `당신은 AI/ML 논문을 한국어로 쉽게 해설하는 전문가입니다. 다음 논문을 분석하고 한국어로 해설해주세요.

## 논문 정보
- 제목: ${paper.title}
- 저자: ${paper.authors.join(', ')}
- 카테고리: ${paper.categories.join(', ')}
- 초록: ${paper.abstract}

## 응답 형식 (반드시 아래 JSON 형식으로만 응답하세요)

\`\`\`json
{
  "title_ko": "한국어로 번역한 논문 제목",
  "tldr": "한 줄 요약 (280자 이내, 트윗 길이. 비전공자도 이해할 수 있는 쉬운 표현)",
  "summary": "5분 이해 해설 (500~800자). 비전공자도 이해할 수 있도록 비유와 쉬운 설명을 사용. 핵심 아이디어가 무엇인지, 기존 방법과 어떻게 다른지, 결과가 왜 중요한지 설명.",
  "key_findings": ["핵심 발견 1", "핵심 발견 2", "핵심 발견 3"],
  "why_it_matters": "왜 중요한지 (실용적 관점에서 설명. 이 연구가 산업계나 일상에 어떤 영향을 미칠 수 있는지, 개발자/기업이 관심을 가져야 하는 이유)",
  "technical_detail": "기술 심화 설명 (전문가를 위한 상세 분석. 모델 아키텍처, 학습 방법, 벤치마크 결과 등 기술적 세부사항. 마크다운 형식, 500~1000자)"
}
\`\`\`

## 작성 가이드
- 모든 내용을 한국어로 작성
- summary는 비전공자가 읽어도 이해할 수 있는 수준
- key_findings는 3~5개
- technical_detail은 전문가용 심화 내용
- JSON만 출력하세요. JSON 외 다른 텍스트는 포함하지 마세요.`;

  try {
    const result = await callGemini(prompt);

    // JSON 블록 추출
    let jsonStr = result;
    const codeBlockMatch = result.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    }

    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;

    return {
      paperId: paper.id,
      titleOriginal: paper.title,
      titleKo: (parsed.title_ko as string) || paper.title,
      tldr: (parsed.tldr as string) || '',
      summary: (parsed.summary as string) || '',
      keyFindings: Array.isArray(parsed.key_findings) ? parsed.key_findings as string[] : [],
      whyItMatters: (parsed.why_it_matters as string) || '',
      technicalDetail: (parsed.technical_detail as string) || '',
    };
  } catch (error) {
    console.error(`[PaperExplainer] 해설 생성 실패 (${paper.title}):`, error);

    // 폴백: 기본 해설
    return {
      paperId: paper.id,
      titleOriginal: paper.title,
      titleKo: paper.title,
      tldr: `${paper.title} - 자세한 해설을 생성하지 못했습니다.`,
      summary: paper.abstract.slice(0, 800),
      keyFindings: ['해설 생성 실패 - 원문 초록을 참조하세요.'],
      whyItMatters: '자동 해설을 생성하지 못했습니다. 원문을 직접 확인해주세요.',
      technicalDetail: `원문 링크: ${paper.arxivUrl}`,
    };
  }
}
