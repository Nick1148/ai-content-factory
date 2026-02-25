/**
 * 데이터 수집기 오케스트레이터
 * Product Hunt와 GitHub 수집기를 통합 실행하고 결과를 병합합니다.
 */

import { collectFromProductHunt } from './producthunt.js';
import { collectFromGitHub } from './github-trending.js';
import { collectFromArxiv } from './arxiv.js';
import type { CollectedTool, CollectionResult, ArxivPaper } from './types.js';

export type { CollectedTool, CollectionResult, ArxivPaper } from './types.js';
export { collectFromArxiv } from './arxiv.js';

function normalizeForComparison(name: string): string {
  return name.toLowerCase().replace(/[-_\s.]/g, '');
}

function isSimilarName(a: string, b: string): boolean {
  const na = normalizeForComparison(a);
  const nb = normalizeForComparison(b);

  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  // Levenshtein distance 기반 유사도 (짧은 이름 기준 30% 이내 차이)
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return true;

  const distance = levenshtein(na, nb);
  return distance / maxLen < 0.3;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[]);

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

function deduplicateTools(tools: CollectedTool[]): CollectedTool[] {
  const result: CollectedTool[] = [];

  for (const tool of tools) {
    const duplicate = result.find((existing) => isSimilarName(existing.name, tool.name));

    if (duplicate) {
      // 중복인 경우 더 많은 정보를 가진 쪽으로 병합
      if (tool.source === 'github' && duplicate.source === 'producthunt') {
        duplicate.stars = tool.stars;
        duplicate.forks = tool.forks;
        duplicate.language = tool.language;
        duplicate.owner = tool.owner;
      } else if (tool.source === 'producthunt' && duplicate.source === 'github') {
        duplicate.votes = tool.votes;
        duplicate.tagline = tool.tagline || duplicate.tagline;
        duplicate.thumbnail = tool.thumbnail || duplicate.thumbnail;
      }
      // 토픽 병합
      const topicSet = new Set([...duplicate.topics, ...tool.topics]);
      duplicate.topics = [...topicSet];
    } else {
      result.push({ ...tool });
    }
  }

  return result;
}

export async function collectAllTools(): Promise<CollectionResult> {
  console.log('=== AI 도구 수집 시작 ===');
  const startTime = Date.now();
  const allErrors: string[] = [];

  // 두 수집기를 병렬 실행
  const [phResult, ghResult] = await Promise.allSettled([
    collectFromProductHunt(),
    collectFromGitHub(),
  ]);

  let allTools: CollectedTool[] = [];

  if (phResult.status === 'fulfilled') {
    allTools.push(...phResult.value.tools);
    allErrors.push(...phResult.value.errors);
  } else {
    allErrors.push(`[ProductHunt] 수집 실패: ${phResult.reason}`);
    console.error('[ProductHunt] 전체 수집 실패:', phResult.reason);
  }

  if (ghResult.status === 'fulfilled') {
    allTools.push(...ghResult.value.tools);
    allErrors.push(...ghResult.value.errors);
  } else {
    allErrors.push(`[GitHub] 수집 실패: ${ghResult.reason}`);
    console.error('[GitHub] 전체 수집 실패:', ghResult.reason);
  }

  // 중복 제거
  const deduped = deduplicateTools(allTools);

  // 인기도 기준 정렬 (votes + stars 합산)
  deduped.sort((a, b) => (b.votes + b.stars) - (a.votes + a.stars));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== 수집 완료: ${deduped.length}개 도구 (원본 ${allTools.length}개, ${elapsed}초 소요) ===`);

  if (allErrors.length > 0) {
    console.warn(`=== 에러 ${allErrors.length}건 ===`);
    allErrors.forEach((e) => console.warn(`  - ${e}`));
  }

  return {
    tools: deduped,
    errors: allErrors,
    collectedAt: new Date().toISOString(),
  };
}

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
  Promise.all([collectAllTools(), collectArxivPapers()])
    .then(([toolResult, papers]) => {
      console.log(`\n수집된 도구 목록 (${toolResult.tools.length}개):`);
      toolResult.tools.forEach((tool, i) => {
        console.log(`  ${i + 1}. [${tool.source}] ${tool.name} - ${tool.tagline}`);
        console.log(`     votes: ${tool.votes} | stars: ${tool.stars} | ${tool.url}`);
      });
      console.log(`\n수집된 논문 목록 (${papers.length}개):`);
      papers.slice(0, 10).forEach((paper, i) => {
        console.log(`  ${i + 1}. [score:${paper.score}] ${paper.title}`);
        console.log(`     ${paper.authors.slice(0, 3).join(', ')}${paper.authors.length > 3 ? ' 외' : ''} | ${paper.arxivUrl}`);
      });
    })
    .catch(console.error);
}
