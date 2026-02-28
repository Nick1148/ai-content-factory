/**
 * 메인 파이프라인 오케스트레이터
 * arXiv 수집 -> AI 해설 -> DB 저장 -> 뉴스레터 발송 전체 플로우를 실행합니다.
 */

import { collectArxivPapers } from './collectors/index.js';
import { processPapers } from './ai/index.js';
import { sendNewsletter } from './publishers/newsletter.js';
import { savePaper, savePaperExplanation, getSubscribers } from './database/repository.js';
import type { ArxivPaper } from './collectors/types.js';
import type { ProcessedPaper } from './content/types.js';
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
  papersCollected: number;
  papersProcessed: number;
}

/**
 * 논문 파이프라인
 * arXiv 수집 -> AI 해설 -> DB 저장 -> 뉴스레터 발송
 */
export async function runPipeline(): Promise<PipelineResult> {
  const pipelineStart = Date.now();
  const startedAt = new Date().toISOString();
  const steps: StepResult[] = [];

  console.log('============================================');
  console.log('  논문읽어주는AI - 파이프라인 시작');
  console.log(`  시작 시간: ${startedAt}`);
  console.log('============================================\n');

  // ──────────────────────────────────────────
  // 1단계: arXiv 논문 수집
  // ──────────────────────────────────────────
  let papers: ArxivPaper[] = [];
  {
    console.log('[Step 1/4] arXiv 논문 수집...');
    const stepStart = Date.now();

    try {
      papers = await collectArxivPapers();
      const elapsed = Date.now() - stepStart;
      steps.push({ name: '논문 수집', success: true, count: papers.length, elapsed });
      console.log(`[Step 1/4] 완료: ${papers.length}편 수집 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 수집', success: false, count: 0, elapsed, error: msg });
      console.error(`[Step 1/4] 실패: ${msg}\n`);
    }
  }

  // ──────────────────────────────────────────
  // 2단계: AI 한국어 해설 생성
  // ──────────────────────────────────────────
  let processedPapers: ProcessedPaper[] = [];
  if (papers.length > 0) {
    console.log('[Step 2/4] 한국어 해설 생성...');
    const stepStart = Date.now();

    try {
      processedPapers = await processPapers(papers);
      const elapsed = Date.now() - stepStart;
      steps.push({ name: '논문 해설 생성', success: true, count: processedPapers.length, elapsed });
      console.log(`[Step 2/4] 완료: ${processedPapers.length}편 해설 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 해설 생성', success: false, count: 0, elapsed, error: msg });
      console.error(`[Step 2/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '논문 해설 생성', success: false, count: 0, elapsed: 0, error: '수집된 논문 없음 - 건너뜀' });
    console.log('[Step 2/4] 건너뜀: 수집된 논문 없음\n');
  }

  // ──────────────────────────────────────────
  // 3단계: DB 저장
  // ──────────────────────────────────────────
  let savedCount = 0;
  if (processedPapers.length > 0) {
    console.log('[Step 3/4] DB 저장...');
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
      console.log(`[Step 3/4] 완료: ${savedCount}편 저장 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '논문 DB 저장', success: false, count: savedCount, elapsed, error: msg });
      console.error(`[Step 3/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '논문 DB 저장', success: false, count: 0, elapsed: 0, error: '해설된 논문 없음 - 건너뜀' });
    console.log('[Step 3/4] 건너뜀: 해설된 논문 없음\n');
  }

  // ──────────────────────────────────────────
  // 4단계: 뉴스레터 발송
  // ──────────────────────────────────────────
  if (processedPapers.length > 0) {
    console.log('[Step 4/4] 뉴스레터 발송...');
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
      console.log(`[Step 4/4] 완료: ${subscribers.length}명에게 발송 (${(elapsed / 1000).toFixed(1)}초)\n`);
    } catch (error) {
      const elapsed = Date.now() - stepStart;
      const msg = error instanceof Error ? error.message : String(error);
      steps.push({ name: '뉴스레터 발송', success: false, count: 0, elapsed, error: msg });
      console.error(`[Step 4/4] 실패: ${msg}\n`);
    }
  } else {
    steps.push({ name: '뉴스레터 발송', success: false, count: 0, elapsed: 0, error: '발송할 논문 없음 - 건너뜀' });
    console.log('[Step 4/4] 건너뜀: 발송할 논문 없음\n');
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
    papersCollected: papers.length,
    papersProcessed: processedPapers.length,
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
  console.log(`  논문: 수집 ${papers.length}편 | 해설 ${processedPapers.length}편 | 저장 ${savedCount}편`);
  console.log('============================================\n');

  return result;
}

// 직접 실행 시 파이프라인 수행
const isDirectRun = process.argv[1]?.includes('pipeline');
if (isDirectRun) {
  runPipeline()
    .then((result) => {
      const allSuccess = result.steps.every((s) => s.success);
      process.exitCode = allSuccess ? 0 : 1;
    })
    .catch((error) => {
      console.error('파이프라인 실행 중 치명적 오류:', error);
      process.exitCode = 1;
    });
}
