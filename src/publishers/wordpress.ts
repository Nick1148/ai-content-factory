/**
 * WordPress REST API 발행 모듈
 * https://developer.wordpress.org/rest-api/reference/posts/
 */

import { config } from '../config/index.js';
import type { PublishInput, PublishResult } from './types.js';

interface WPPostResponse {
  id: number;
  link: string;
}

interface WPTagResponse {
  id: number;
  name: string;
}

async function getOrCreateTags(tags: string[]): Promise<number[]> {
  const { url, username, password } = config.publishers.wordpress;
  const apiBase = getApiBase(url);
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  const tagIds: number[] = [];

  for (const tagName of tags.slice(0, 5)) {
    try {
      // 기존 태그 검색
      const searchRes = await fetch(
        `${apiBase}/tags?search=${encodeURIComponent(tagName)}`,
        { headers: { Authorization: authHeader } },
      );

      if (searchRes.ok) {
        const existing = (await searchRes.json()) as WPTagResponse[];
        const match = existing.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
        if (match) {
          tagIds.push(match.id);
          continue;
        }
      }

      // 새 태그 생성
      const createRes = await fetch(`${apiBase}/tags`, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tagName }),
      });

      if (createRes.ok) {
        const created = (await createRes.json()) as WPTagResponse;
        tagIds.push(created.id);
      }
    } catch {
      // 태그 실패는 무시하고 계속 진행
    }
  }

  return tagIds;
}

function getApiBase(wpUrl: string): string {
  // WordPress.com 호스팅 감지 → public-api 사용
  const hostname = new URL(wpUrl).hostname;
  if (hostname.endsWith('.wordpress.com')) {
    return `https://public-api.wordpress.com/wp/v2/sites/${hostname}`;
  }
  return `${wpUrl}/wp-json/wp/v2`;
}

export async function publishToWordPress(input: PublishInput): Promise<PublishResult> {
  const { url: wpUrl, username, password } = config.publishers.wordpress;

  if (!wpUrl || !username || !password) {
    return {
      platform: 'wordpress',
      success: false,
      publishedUrl: null,
      error: 'WORDPRESS_URL, WORDPRESS_USERNAME, 또는 WORDPRESS_APP_PASSWORD가 설정되지 않았습니다.',
      publishedAt: null,
    };
  }

  try {
    console.log('[WordPress] 발행 시작...');

    const apiBase = getApiBase(wpUrl);
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    const tagIds = await getOrCreateTags(input.tags);

    const response = await fetch(`${apiBase}/posts`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: input.title,
        content: input.contentMarkdown,
        status: 'draft',
        tags: tagIds,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`WordPress API 오류: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as WPPostResponse;
    const publishedAt = new Date().toISOString();

    console.log(`[WordPress] 발행 성공: ${data.link}`);
    return {
      platform: 'wordpress',
      success: true,
      publishedUrl: data.link,
      error: null,
      publishedAt,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[WordPress] 발행 실패: ${msg}`);
    return {
      platform: 'wordpress',
      success: false,
      publishedUrl: null,
      error: msg,
      publishedAt: null,
    };
  }
}
