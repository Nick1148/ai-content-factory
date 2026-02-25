/**
 * 메인 파이프라인 오케스트레이터
 * 수집 -> AI 가공 -> DB 저장 -> 발행 전체 플로우를 실행합니다.
 */

import { collectAllTools, collectArxivPapers } from './collectors/index.js';
import { processTools, processPapers } from './ai/index.js';
import { publishToAll } from './publishers/index.js';
import { sendNewsletter } from './publishers/newsletter.js';
import { saveTool, saveReview, savePublishLog, savePaper, savePaperExplanation, getSubscribers } from './database/repository.js';
import type { CollectedTool, ArxivPaper } from './collectors/types.js';
import type { ProcessedContent, ProcessedPaper } from './content/types.js';
import type { PublishLogInsert } from './database/types.js';
import type { PaperForEmail } from './publishers/newsletter-template.js';

interface StepResult {
  name: string;
  success: boolean;
  count: number;
  elapsed: number;
  error?: string;
}

interface PipelineResult {
  startedAt: string;
  finishedAt: string;
  totalElapsed: number;
  steps: StepResult[];
  toolsCollected: number;
  toolsProcessed: number;
  reviewsSaved: number;
  publishResults: number;
  papersCollected: number;
  papersProcessed: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

export async function runDailyPipeline(): Promise<PipelineResult> {
  const pipelineStart = Date.now();
  const startedAt = new Date().toISOString();
  const steps: StepResult[] = [];

  console.log('============================================');
  console.log('  AI Content Factory - 일일 파이프라인 시작');
  console.log(`  시작 시간: ${startedAt}`);
  console.log('============================================\n');

  // ──────────────────────────────────────────
  // 1단계: 데이터 수집
  // ──────────────────────────────────────────
  let collectedTools: CollectedTool[] = [];
  {
    console.log('[Step 1/4] 데이터 수집...');
    const stepStart = Date.now();

    try {
      const result = await collectAllTools();
      collectedTools = result.tools;
      const elapsed = Date.now() - stepStart;

      steps.push({
        name: '데이터 수집',
        success: true,
        count: collectedTools.length,
        elapsed,
      });

      console.log(`[Step 1/4] 완료: ${collectedTools.length}개 도구 수집 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '데이터 수집', success: false, count: 0, elapsed, error: msg });
      console.error(`[Step 1/4] 실패: ${msg}\n`);
    }
  }

  // ──────────────────────────────────────────
  // 2단계: AI 가공
  // ──────────────────────────────────────────
  let processedContents: ProcessedContent[] = [];
  if (collectedTools.length > 0) {
    console.log('[Step 2/4] AI 콘텐츠 생성...');
    const stepStart = Date.now();

    try {
      processedContents = await processTools(collectedTools);
      const elapsed = Date.now() - stepStart;

      steps.push({
        name: 'AI 콘텐츠 생성',
        success: true,
        count: processedContents.length,
        elapsed,
      });

      console.log(`[Step 2/4] 완료: ${processedContents.length}개 리뷰 생성 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: 'AI 콘텐츠 생성', success: false, count: 0, elapsed, error: msg });
      console.error(`[Step 2/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: 'AI 콘텐츠 생성', success: false, count: 0, elapsed: 0, error: '수집된 도구 없음 - 건너뜀' });
    console.log('[Step 2/4] 건너뜀: 수집된 도구 없음\n');
  }

  // ──────────────────────────────────────────
  // 3단계: DB 저장
  // ──────────────────────────────────────────
  let reviewsSaved = 0;
  const toolIdMap = new Map<string, string>(); // toolName -> tool.id
  const reviewIdMap = new Map<string, string>(); // toolName -> review.id

  if (processedContents.length > 0) {
    console.log('[Step 3/4] DB 저장...');
    const stepStart = Date.now();

    try {
      for (const processed of processedContents) {
        // 도구 저장
        const slug = slugify(processed.toolName);
        const savedTool = await saveTool({
          slug,
          name: processed.toolName,
          tagline: processed.review.summary,
          description: processed.review.content.slice(0, 500),
          category: processed.category,
          source: 'producthunt',
          url: '',
          trend_score: processed.trendScore,
        });

        if (savedTool) {
          toolIdMap.set(processed.toolName, savedTool.id);

          // 리뷰 저장
          const savedReview = await saveReview({
            tool_id: savedTool.id,
            title: processed.review.title,
            summary: processed.review.summary,
            pros: processed.review.pros,
            cons: processed.review.cons,
            use_cases: processed.review.useCases,
            alternatives: processed.review.alternatives,
            rating: processed.review.rating,
            content_markdown: processed.review.content,
          });

          if (savedReview) {
            reviewIdMap.set(processed.toolName, savedReview.id);
            reviewsSaved++;
          }
        }
      }

      const elapsed = Date.now() - stepStart;
      steps.push({
        name: 'DB 저장',
        success: true,
        count: reviewsSaved,
        elapsed,
      });

      console.log(`[Step 3/4] 완료: ${reviewsSaved}개 리뷰 저장 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: 'DB 저장', success: false, count: reviewsSaved, elapsed, error: msg });
      console.error(`[Step 3/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: 'DB 저장', success: false, count: 0, elapsed: 0, error: '처리된 콘텐츠 없음 - 건너뜀' });
    console.log('[Step 3/4] 건너뜀: 처리된 콘텐츠 없음\n');
  }

  // ──────────────────────────────────────────
  // 4단계: 발행
  // ──────────────────────────────────────────
  let publishCount = 0;

  if (processedContents.length > 0 && reviewIdMap.size > 0) {
    console.log('[Step 4/4] 플랫폼 발행...');
    const stepStart = Date.now();

    try {
      for (const processed of processedContents) {
        const reviewId = reviewIdMap.get(processed.toolName);
        if (!reviewId) continue;

        // WordPress 콘텐츠를 canonical 기준으로 사용
        const wpContent = processed.platformContents.wordpress;
        const publishResult = await publishToAll({
          title: processed.review.title,
          contentMarkdown: processed.review.content,
          tags: wpContent.tags,
          canonicalUrl: wpContent.canonicalUrl,
        });

        // 발행 로그 DB 저장
        for (const result of publishResult.results) {
          const logEntry: PublishLogInsert = {
            review_id: reviewId,
            platform: result.platform,
            published_url: result.publishedUrl,
            status: result.success ? 'success' : 'failed',
            published_at: result.publishedAt,
            error_message: result.error,
          };
          await savePublishLog(logEntry);
          if (result.success) publishCount++;
        }
      }

      const elapsed = Date.now() - stepStart;
      steps.push({
        name: '플랫폼 발행',
        success: true,
        count: publishCount,
        elapsed,
      });

      console.log(`[Step 4/4] 완료: ${publishCount}건 발행 성공 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '플랫폼 발행', success: false, count: publishCount, elapsed, error: msg });
      console.error(`[Step 4/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '플랫폼 발행', success: false, count: 0, elapsed: 0, error: '발행할 콘텐츠 없음 - 건너뜀' });
    console.log('[Step 4/4] 건너뜀: 발행할 콘텐츠 없음\n');
  }

  // ──────────────────────────────────────────
  // 실행 결과 요약
  // ──────────────────────────────────────────
  const finishedAt = new Date().toISOString();
  const totalElapsed = Date.now() - pipelineStart;

  const result: PipelineResult = {
    startedAt,
    finishedAt,
    totalElapsed,
    steps,
    toolsCollected: collectedTools.length,
    toolsProcessed: processedContents.length,
    reviewsSaved,
    publishResults: publishCount,
    papersCollected: 0,
    papersProcessed: 0,
  };

  console.log('============================================');
  console.log('  파이프라인 실행 결과 요약');
  console.log('============================================');
  console.log(`  시작: ${startedAt}`);
  console.log(`  종료: ${finishedAt}`);
  console.log(`  총 소요: ${(totalElapsed / 1000).toFixed(1)}초`);
  console.log('--------------------------------------------');

  for (const step of steps) {
    const status = step.success ? 'OK' : 'FAIL';
    const detail = step.error ? ` (${step.error})` : '';
    console.log(`  [${status}] ${step.name}: ${step.count}건 (${(step.elapsed / 1000).toFixed(1)}초)${detail}`);
  }

  console.log('--------------------------------------------');
  console.log(`  수집: ${collectedTools.length}개 | 가공: ${processedContents.length}개 | 저장: ${reviewsSaved}개 | 발행: ${publishCount}건`);
  console.log('============================================\n');

  return result;
}

/**
 * 논문 파이프라인
 * arXiv 수집 -> AI 해설 -> DB 저장 -> 뉴스레터 발송
 */
export async function runPapersPipeline(): Promise<{ steps: StepResult[]; papersCollected: number; papersProcessed: number }> {
  const steps: StepResult[] = [];

  console.log('\n============================================');
  console.log('  논문 해설 파이프라인 시작');
  console.log('============================================\n');

  // ──────────────────────────────────────────
  // 1단계: arXiv 논문 수집
  // ──────────────────────────────────────────
  let papers: ArxivPaper[] = [];
  {
    console.log('[Papers 1/4] arXiv 논문 수집...');
    const stepStart = Date.now();

    try {
      papers = await collectArxivPapers();
      const elapsed = Date.now() - stepStart;
      steps.push({ name: '논문 수집', success: true, count: papers.length, elapsed });
      console.log(`[Papers 1/4] 완료: ${papers.length}편 수집 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 수집', success: false, count: 0, elapsed, error: msg });
      console.error(`[Papers 1/4] 실패: ${msg}\n`);
    }
  }

  // ──────────────────────────────────────────
  // 2단계: AI 한국어 해설 생성
  // ──────────────────────────────────────────
  let processedPapers: ProcessedPaper[] = [];
  if (papers.length > 0) {
    console.log('[Papers 2/4] 한국어 해설 생성...');
    const stepStart = Date.now();

    try {
      processedPapers = await processPapers(papers);
      const elapsed = Date.now() - stepStart;
      steps.push({ name: '논문 해설 생성', success: true, count: processedPapers.length, elapsed });
      console.log(`[Papers 2/4] 완료: ${processedPapers.length}편 해설 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 해설 생성', success: false, count: 0, elapsed, error: msg });
      console.error(`[Papers 2/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '논문 해설 생성', success: false, count: 0, elapsed: 0, error: '수집된 논문 없음 - 건너뜀' });
    console.log('[Papers 2/4] 건너뜀: 수집된 논문 없음\n');
  }

  // ──────────────────────────────────────────
  // 3단계: DB 저장
  // ──────────────────────────────────────────
  let savedCount = 0;
  if (processedPapers.length > 0) {
    console.log('[Papers 3/4] DB 저장...');
    const stepStart = Date.now();

    try {
      for (const { paper, explanation } of processedPapers) {
        const savedPaper = await savePaper({
          arxiv_id: paper.id,
          title: paper.title,
          title_ko: explanation.titleKo,
          abstract: paper.abstract,
          authors: paper.authors,
          categories: paper.categories,
          published_date: paper.publishedDate,
          pdf_url: paper.pdfUrl,
          arxiv_url: paper.arxivUrl,
          score: paper.score,
        });

        if (savedPaper) {
          await savePaperExplanation({
            paper_id: savedPaper.id,
            tldr: explanation.tldr,
            summary: explanation.summary,
            key_findings: explanation.keyFindings,
            why_it_matters: explanation.whyItMatters,
            technical_detail: explanation.technicalDetail,
          });
          savedCount++;
        }
      }

      const elapsed = Date.now() - stepStart;
      steps.push({ name: '논문 DB 저장', success: true, count: savedCount, elapsed });
      console.log(`[Papers 3/4] 완료: ${savedCount}편 저장 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 DB 저장', success: false, count: savedCount, elapsed, error: msg });
      console.error(`[Papers 3/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '논문 DB 저장', success: false, count: 0, elapsed: 0, error: '해설된 논문 없음 - 건너뜀' });
    console.log('[Papers 3/4] 건너뜀: 해설된 논문 없음\n');
  }

  // ──────────────────────────────────────────
  // 4단계: 뉴스레터 발송
  // ──────────────────────────────────────────
  if (processedPapers.length > 0) {
    console.log('[Papers 4/4] 뉴스레터 발송...');
    const stepStart = Date.now();

    try {
      const subscribers = await getSubscribers();
      const papersForEmail: PaperForEmail[] = processedPapers.map(({ paper, explanation }) => ({
        title: explanation.titleKo || paper.title,
        tldr: explanation.tldr,
        summary: explanation.summary,
        keyFindings: explanation.keyFindings,
        category: paper.categories[0] ?? 'AI',
        arxivUrl: paper.arxivUrl,
      }));

      await sendNewsletter(papersForEmail, subscribers);

      const elapsed = Date.now() - stepStart;
      steps.push({ name: '뉴스레터 발송', success: true, count: subscribers.length, elapsed });
      console.log(`[Papers 4/4] 완료: ${subscribers.length}명에게 발송 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '뉴스레터 발송', success: false, count: 0, elapsed, error: msg });
      console.error(`[Papers 4/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '뉴스레터 발송', success: false, count: 0, elapsed: 0, error: '발송할 논문 없음 - 건너뜀' });
    console.log('[Papers 4/4] 건너뜀: 발송할 논문 없음\n');
  }

  return { steps, papersCollected: papers.length, papersProcessed: processedPapers.length };
}

/**
 * 통합 파이프라인 (도구 + 논문)
 */
export async function runFullPipeline(): Promise<PipelineResult> {
  const fullStart = Date.now();
  const startedAt = new Date().toISOString();

  console.log('****************************************************');
  console.log('  AI Content Factory - 통합 파이프라인 (도구 + 논문)');
  console.log(`  시작 시간: ${startedAt}`);
  console.log('****************************************************\n');

  // 도구 파이프라인 실행
  const toolResult = await runDailyPipeline();

  // 논문 파이프라인 실행
  const paperResult = await runPapersPipeline();

  const finishedAt = new Date().toISOString();
  const totalElapsed = Date.now() - fullStart;

  const allSteps = [...toolResult.steps, ...paperResult.steps];

  const result: PipelineResult = {
    startedAt,
    finishedAt,
    totalElapsed,
    steps: allSteps,
    toolsCollected: toolResult.toolsCollected,
    toolsProcessed: toolResult.toolsProcessed,
    reviewsSaved: toolResult.reviewsSaved,
    publishResults: toolResult.publishResults,
    papersCollected: paperResult.papersCollected,
    papersProcessed: paperResult.papersProcessed,
  };

  console.log('****************************************************');
  console.log('  통합 파이프라인 최종 결과');
  console.log('****************************************************');
  console.log(`  총 소요: ${(totalElapsed / 1000).toFixed(1)}초`);
  console.log(`  도구: 수집 ${toolResult.toolsCollected} | 가공 ${toolResult.toolsProcessed} | 저장 ${toolResult.reviewsSaved} | 발행 ${toolResult.publishResults}`);
  console.log(`  논문: 수집 ${paperResult.papersCollected} | 해설 ${paperResult.papersProcessed}`);
  console.log('****************************************************\n');

  return result;
}

// 직접 실행 시 파이프라인 수행
const isDirectRun = process.argv[1]?.includes('pipeline');
if (isDirectRun) {
  const args = process.argv.slice(2);
  const mode = args.includes('--full') ? 'full' : args.includes('--papers') ? 'papers' : 'tools';

  let runner: () => Promise<{ steps: StepResult[] }>;

  switch (mode) {
    case 'full':
      runner = runFullPipeline;
      break;
    case 'papers':
      runner = runPapersPipeline;
      break;
    default:
      runner = runDailyPipeline;
      break;
  }

  runner()
    .then((result) => {
      const allSuccess = result.steps.every((s) => s.success);
      process.exitCode = allSuccess ? 0 : 1;
    })
    .catch((error) => {
      console.error('파이프라인 실행 중 치명적 오류:', error);
      process.exitCode = 1;
    });
}
