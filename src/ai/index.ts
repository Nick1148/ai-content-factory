/**
 * AI 엔진 오케스트레이터
 * 수집된 논문에 대해 한국어 해설을 생성합니다.
 */

import { generatePaperExplanation } from './paper-explainer.js';
import type { ArxivPaper } from '../collectors/types.js';
import type { ProcessedPaper } from '../content/types.js';

const TOP_PAPERS_MIN = 5;
const TOP_PAPERS_MAX = 7;
const RATE_LIMIT_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processPapers(papers: ArxivPaper[]): Promise<ProcessedPaper[]> {
  console.log(`\n=== AI 논문 해설 생성 시작 (${papers.length}편) ===`);
  const startTime = Date.now();

  if (papers.length === 0) {
    console.warn('처리할 논문이 없습니다.');
    return [];
  }

  // 1단계: 중요도 기반 상위 5~7개 선별 (score 기준 내림차순)
  console.log('\n[1/2] 상위 논문 선별...');
  const sorted = [...papers].sort((a, b) => b.score - a.score);

  const topCount = Math.min(
    TOP_PAPERS_MAX,
    Math.max(TOP_PAPERS_MIN, sorted.length)
  );
  const topPapers = sorted.slice(0, topCount);

  console.log(`  선별된 ${topPapers.length}편:`);
  topPapers.forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.categories[0] ?? 'unknown'}] ${p.title.slice(0, 60)}... (score: ${p.score})`);
  });

  // 2단계: 각 논문에 대해 한국어 해설 생성
  console.log('\n[2/2] 한국어 해설 생성...');
  const results: ProcessedPaper[] = [];

  for (const paper of topPapers) {
    try {
      console.log(`  - "${paper.title.slice(0, 50)}..." 해설 생성 중...`);
      const explanation = await generatePaperExplanation(paper);
      results.push({ paper, explanation });
      console.log(`  - 완료: ${explanation.titleKo}`);
    } catch (error) {
      console.error(`  - "${paper.title.slice(0, 50)}..." 해설 생성 실패:`, error);
    }

    await delay(RATE_LIMIT_MS);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== 논문 해설 완료: ${results.length}편 (${elapsed}초 소요) ===`);

  return results;
}

export type { ProcessedPaper } from '../content/types.js';
