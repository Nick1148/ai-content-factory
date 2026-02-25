/**
 * Resend API를 사용한 뉴스레터 발송 모듈
 * https://resend.com/docs/api-reference/emails/send-email
 */

import { config } from '../config/index.js';
import { generateEmailHtml, type PaperForEmail } from './newsletter-template.js';

const RESEND_API_URL = 'https://api.resend.com/emails';
const BATCH_SIZE = 50; // Resend 무료 tier 고려, 배치당 50명
const BATCH_DELAY_MS = 1000; // 배치 간 1초 딜레이

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface ResendResponse {
  id?: string;
  message?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmail(payload: ResendEmailPayload): Promise<ResendResponse> {
  const apiKey = config.resend.apiKey;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY가 설정되지 않았습니다.');
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json() as ResendResponse;

  if (!response.ok) {
    throw new Error(`Resend API 오류 (${response.status}): ${data.message || 'Unknown error'}`);
  }

  return data;
}

export async function sendNewsletter(
  papers: PaperForEmail[],
  subscribers: string[],
): Promise<void> {
  if (subscribers.length === 0) {
    console.log('[Newsletter] 구독자가 없습니다. 건너뜁니다.');
    return;
  }

  if (papers.length === 0) {
    console.log('[Newsletter] 발송할 논문이 없습니다. 건너뜁니다.');
    return;
  }

  const today = new Date().toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
  const subject = `[AI Paper Daily] ${today} - 오늘의 AI 논문 ${papers.length}편`;
  const html = generateEmailHtml(papers);

  console.log(`[Newsletter] ${subscribers.length}명에게 발송 시작 (${papers.length}편 논문)`);

  const batches: string[][] = [];
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    batches.push(subscribers.slice(i, i + BATCH_SIZE));
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`[Newsletter] 배치 ${i + 1}/${batches.length} (${batch.length}명)...`);

    try {
      await sendEmail({
        from: 'AI Paper Daily <newsletter@aitoolradar.com>',
        to: batch,
        subject,
        html,
      });
      successCount += batch.length;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[Newsletter] 배치 ${i + 1} 실패: ${msg}`);
      failCount += batch.length;
    }

    // 마지막 배치가 아니면 딜레이
    if (i < batches.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`[Newsletter] 발송 완료: 성공 ${successCount}명, 실패 ${failCount}명`);
}
