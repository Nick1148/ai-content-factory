/**
 * AI 엔진 오케스트레이터
 * 수집된 도구에 대해 카테고리 분류, 트렌드 점수 산정, 리뷰 생성, 플랫폼 변형을 수행합니다.
 */

import { categorize, scoreTrend } from './gemini.js';
import { generateReview } from './review-generator.js';
import { generatePaperExplanation } from './paper-explainer.js';
import { adaptForPlatform } from '../content/platform-adapter.js';
import type { CollectedTool, ArxivPaper } from '../collectors/types.js';
import type { Platform, ProcessedContent, ProcessedPaper, ToolCategory } from '../content/types.js';

const ALL_PLATFORMS: Platform[] = ['medium', 'devto', 'hashnode', 'wordpress'];

const TOP_TOOLS_MIN = 5;
const TOP_TOOLS_MAX = 7;
const RATE_LIMIT_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ScoredTool {
  tool: CollectedTool;
  category: ToolCategory;
  trendScore: number;
}

export async function processTools(tools: CollectedTool[]): Promise<ProcessedContent[]> {
  console.log(`\n=== AI 콘텐츠 생성 시작 (${tools.length}개 도구) ===`);
  const startTime = Date.now();

  if (tools.length === 0) {
    console.warn('처리할 도구가 없습니다.');
    return [];
  }

  // 1단계: 각 도구 카테고리 분류 + 트렌드 점수 산정
  console.log('\n[1/4] 카테고리 분류 및 트렌드 점수 산정...');
  const scoredTools: ScoredTool[] = [];

  for (const tool of tools) {
    try {
      const [category, trendScore] = await Promise.all([
        categorize(tool),
        scoreTrend(tool),
      ]);

      scoredTools.push({ tool, category, trendScore });
      console.log(`  - ${tool.name}: ${category} (트렌드 ${trendScore}점)`);
    } catch (error) {
      console.error(`  - ${tool.name}: 분류 실패`, error);
      scoredTools.push({ tool, category: 'Other', trendScore: 50 });
    }

    await delay(RATE_LIMIT_MS);
  }

  // 2단계: 상위 5~7개 도구 선별
  console.log('\n[2/4] 상위 도구 선별...');
  scoredTools.sort((a, b) => b.trendScore - a.trendScore);

  const topCount = Math.min(
    TOP_TOOLS_MAX,
    Math.max(TOP_TOOLS_MIN, scoredTools.length)
  );
  const topTools = scoredTools.slice(0, topCount);

  console.log(`  선별된 ${topTools.length}개 도구:`);
  topTools.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.tool.name} (${t.category}, 트렌드 ${t.trendScore})`);
  });

  // 3단계: 각 도구에 대해 리뷰 생성
  console.log('\n[3/4] AI 리뷰 생성...');
  const results: ProcessedContent[] = [];

  for (const { tool, category, trendScore } of topTools) {
    try {
      console.log(`  - ${tool.name} 리뷰 생성 중...`);
      const review = await generateReview(tool);

      await delay(RATE_LIMIT_MS);

      // 4단계: 4개 플랫폼별 콘텐츠 변형
      console.log(`  - ${tool.name} 플랫폼별 변형 중...`);
      const platformContents = {} as Record<Platform, ReturnType<typeof adaptForPlatform>>;

      for (const platform of ALL_PLATFORMS) {
        platformContents[platform] = adaptForPlatform(review, platform);
      }

      results.push({
        toolName: tool.name,
        category,
        trendScore,
        review,
        platformContents,
      });

      console.log(`  - ${tool.name} 처리 완료 (평점: ${review.rating}/5)`);
    } catch (error) {
      console.error(`  - ${tool.name} 리뷰 생성 실패:`, error);
    }

    await delay(RATE_LIMIT_MS);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== AI 콘텐츠 생성 완료: ${results.length}개 리뷰 (${elapsed}초 소요) ===`);

  return results;
}

const TOP_PAPERS_MIN = 5;
const TOP_PAPERS_MAX = 7;

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

export type { ProcessedContent, ProcessedPaper } from '../content/types.js';
