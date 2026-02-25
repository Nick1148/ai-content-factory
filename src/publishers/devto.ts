/**
 * DEV.to REST API 발행 모듈
 * https://developers.forem.com/api/v1
 */

import { config } from '../config/index.js';
import type { PublishInput, PublishResult } from './types.js';

interface DevtoArticleResponse {
  id: number;
  url: string;
}

export async function publishToDevto(input: PublishInput): Promise<PublishResult> {
  const { apiKey } = config.publishers.devto;

  if (!apiKey) {
    return {
      platform: 'devto',
      success: false,
      publishedUrl: null,
      error: 'DEVTO_API_KEY가 설정되지 않았습니다.',
      publishedAt: null,
    };
  }

  try {
    console.log('[DEV.to] 발행 시작...');

    const response = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: {
          title: input.title,
          body_markdown: input.contentMarkdown,
          published: false,
          tags: input.tags.slice(0, 4),
          canonical_url: input.canonicalUrl ?? undefined,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`DEV.to API 오류: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as DevtoArticleResponse;
    const publishedAt = new Date().toISOString();

    console.log(`[DEV.to] 발행 성공: ${data.url}`);
    return {
      platform: 'devto',
      success: true,
      publishedUrl: data.url,
      error: null,
      publishedAt,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[DEV.to] 발행 실패: ${msg}`);
    return {
      platform: 'devto',
      success: false,
      publishedUrl: null,
      error: msg,
      publishedAt: null,
    };
  }
}
