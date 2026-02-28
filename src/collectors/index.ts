/**
 * 데이터 수집기 오케스트레이터
 * arXiv에서 최신 AI/ML 논문을 수집합니다.
 */

import { collectFromArxiv } from './arxiv.js';
import type { ArxivPaper } from './types.js';

export type { ArxivPaper } from './types.js';
export { collectFromArxiv } from './arxiv.js';

export async function collectArxivPapers(): Promise<ArxivPaper[]> {
  console.log('=== arXiv 논문 수집 시작 ===');
  const startTime = Date.now();

  try {
    const papers = await collectFromArxiv();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`=== arXiv 수집 완료: ${papers.length}개 논문 (${elapsed}초 소요) ===`);
    return papers;
  } catch (err) {
    console.error('=== arXiv 수집 실패 ===', err);
    return [];
  }
}

// 직접 실행 시 수집 수행
const isDirectRun = process.argv[1]?.includes('collectors');
if (isDirectRun) {
  collectArxivPapers()
    .then((papers) => {
      console.log(`\n수집된 논문 목록 (${papers.length}개):`);
      papers.slice(0, 10).forEach((paper, i) => {
        console.log(`  ${i + 1}. [score:${paper.score}] ${paper.title}`);
        console.log(`     ${paper.authors.slice(0, 3).join(', ')}${paper.authors.length > 3 ? ' 외' : ''} | ${paper.arxivUrl}`);
      });
    })
    .catch(console.error);
}
