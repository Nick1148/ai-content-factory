/**
 * Medium REST API 발행 모듈
 * https://github.com/Medium/medium-api-docs
 */

import { config } from '../config/index.js';
import type { PublishInput, PublishResult } from './types.js';

interface MediumUser {
  data: { id: string };
}

interface MediumPostResponse {
  data: { id: string; url: string };
}

async function getMediumUserId(): Promise<string> {
  const { token } = config.publishers.medium;

  const response = await fetch('https://api.medium.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Medium 사용자 조회 실패: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as MediumUser;
  return data.data.id;
}

export async function publishToMedium(input: PublishInput): Promise<PublishResult> {
  const { token } = config.publishers.medium;

  if (!token) {
    return {
      platform: 'medium',
      success: false,
      publishedUrl: null,
      error: 'MEDIUM_TOKEN이 설정되지 않았습니다.',
      publishedAt: null,
    };
  }

  try {
    console.log('[Medium] 발행 시작...');

    const userId = await getMediumUserId();

    const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title: input.title,
        contentFormat: 'markdown',
        content: input.contentMarkdown,
        tags: input.tags.slice(0, 5),
        canonicalUrl: input.canonicalUrl ?? undefined,
        publishStatus: 'draft',
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Medium API 오류: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MediumPostResponse;
    const publishedAt = new Date().toISOString();

    console.log(`[Medium] 발행 성공: ${data.data.url}`);
    return {
      platform: 'medium',
      success: true,
      publishedUrl: data.data.url,
      error: null,
      publishedAt,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Medium] 발행 실패: ${msg}`);
    return {
      platform: 'medium',
      success: false,
      publishedUrl: null,
      error: msg,
      publishedAt: null,
    };
  }
}
