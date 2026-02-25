/**
 * Product Hunt GraphQL API v2 데이터 수집기
 * 오늘의 AI/테크 도구를 수집합니다.
 */

import { config } from '../config/index.js';
import type { ProductHuntPost, CollectedTool } from './types.js';

const POSTS_QUERY = `
  query GetTodayPosts($first: Int!, $topic: String) {
    posts(first: $first, topic: $topic, order: VOTES) {
      edges {
        node {
          name
          tagline
          description
          votesCount
          url
          thumbnail {
            url
          }
          topics {
            edges {
              node {
                name
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

const AI_TOPICS = ['artificial-intelligence', 'machine-learning', 'developer-tools', 'tech'];

function postToCollectedTool(post: ProductHuntPost): CollectedTool {
  return {
    name: post.name,
    tagline: post.tagline,
    description: post.description ?? '',
    url: post.url,
    thumbnail: post.thumbnail?.url ?? null,
    votes: post.votesCount,
    stars: 0,
    forks: 0,
    language: null,
    topics: post.topics.edges.map((e) => e.node.name),
    owner: '',
    source: 'producthunt',
    collectedAt: new Date().toISOString(),
  };
}

async function fetchPosts(topic: string): Promise<ProductHuntPost[]> {
  const { token, apiUrl } = config.productHunt;

  if (!token) {
    throw new Error('PRODUCTHUNT_TOKEN 환경변수가 설정되지 않았습니다.');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: { first: 20, topic },
    }),
  });

  if (!response.ok) {
    throw new Error(`Product Hunt API 오류: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    data?: { posts?: { edges: Array<{ node: ProductHuntPost }> } };
    errors?: Array<{ message: string }>;
  };

  if (data.errors?.length) {
    throw new Error(`Product Hunt GraphQL 오류: ${data.errors[0].message}`);
  }

  return data.data?.posts?.edges.map((e) => e.node) ?? [];
}

export async function collectFromProductHunt(): Promise<{
  tools: CollectedTool[];
  errors: string[];
}> {
  const tools: CollectedTool[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  console.log('[ProductHunt] 수집 시작...');

  for (const topic of AI_TOPICS) {
    try {
      const posts = await fetchPosts(topic);
      for (const post of posts) {
        if (!seen.has(post.name)) {
          seen.add(post.name);
          tools.push(postToCollectedTool(post));
        }
      }
      console.log(`[ProductHunt] 토픽 "${topic}": ${posts.length}개 수집`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[ProductHunt/${topic}] ${msg}`);
      console.error(`[ProductHunt] 토픽 "${topic}" 수집 실패:`, msg);
    }
  }

  console.log(`[ProductHunt] 총 ${tools.length}개 도구 수집 완료 (에러: ${errors.length}건)`);
  return { tools, errors };
}
