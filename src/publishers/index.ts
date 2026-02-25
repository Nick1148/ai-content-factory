/**
 * 발행 오케스트레이터
 * 4개 플랫폼에 콘텐츠를 발행하고 결과를 취합합니다.
 */

import { publishToMedium } from './medium.js';
import { publishToDevto } from './devto.js';
import { publishToHashnode } from './hashnode.js';
import { publishToWordPress } from './wordpress.js';
import type { PublishInput, PublishResult } from './types.js';
import type { PublishPlatform } from '../database/types.js';

export type { PublishInput, PublishResult } from './types.js';

type PublisherFn = (input: PublishInput) => Promise<PublishResult>;

const publishers: Record<PublishPlatform, PublisherFn> = {
  medium: publishToMedium,
  devto: publishToDevto,
  hashnode: publishToHashnode,
  wordpress: publishToWordPress,
};

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function publishWithRetry(
  platform: PublishPlatform,
  fn: PublisherFn,
  input: PublishInput,
): Promise<PublishResult> {
  let lastResult: PublishResult | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      console.log(`[${platform}] 재시도 ${attempt}/${MAX_RETRIES}...`);
      await sleep(RETRY_DELAY_MS * attempt);
    }

    lastResult = await fn(input);

    if (lastResult.success) {
      return lastResult;
    }
  }

  return lastResult!;
}

export interface PublishAllResult {
  results: PublishResult[];
  successCount: number;
  failedCount: number;
  publishedAt: string;
}

export async function publishToAll(
  input: PublishInput,
  platforms?: PublishPlatform[],
): Promise<PublishAllResult> {
  const targetPlatforms = platforms ?? (['medium', 'devto', 'hashnode', 'wordpress'] as PublishPlatform[]);

  console.log(`=== ${targetPlatforms.length}개 플랫폼 발행 시작 ===`);
  const startTime = Date.now();

  // 병렬 발행 (재시도 포함)
  const results = await Promise.all(
    targetPlatforms.map((platform) =>
      publishWithRetry(platform, publishers[platform], input),
    ),
  );

  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.length - successCount;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`=== 발행 완료: 성공 ${successCount}건, 실패 ${failedCount}건 (${elapsed}초 소요) ===`);

  for (const result of results) {
    const status = result.success ? 'OK' : 'FAIL';
    const detail = result.success ? result.publishedUrl : result.error;
    console.log(`  [${status}] ${result.platform}: ${detail}`);
  }

  return {
    results,
    successCount,
    failedCount,
    publishedAt: new Date().toISOString(),
  };
}

// 직접 실행 시 테스트
const isDirectRun = process.argv[1]?.includes('publishers');
if (isDirectRun) {
  const testInput: PublishInput = {
    title: '[테스트] AI Content Factory 발행 테스트',
    contentMarkdown: '# 테스트\n\n이것은 발행 테스트입니다.',
    tags: ['ai', 'test'],
  };

  publishToAll(testInput)
    .then((result) => {
      console.log(`\n발행 결과: 성공 ${result.successCount} / 실패 ${result.failedCount}`);
    })
    .catch(console.error);
}
