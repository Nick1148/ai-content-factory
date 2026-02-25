/**
 * Hashnode GraphQL API 발행 모듈
 * https://apidocs.hashnode.com/
 */

import { config } from '../config/index.js';
import type { PublishInput, PublishResult } from './types.js';

const HASHNODE_API = 'https://gql.hashnode.com';

const PUBLISH_POST_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        url
        title
      }
    }
  }
`;

interface HashnodePublishResponse {
  data?: {
    publishPost?: {
      post: { id: string; url: string; title: string };
    };
  };
  errors?: Array<{ message: string }>;
}

export async function publishToHashnode(input: PublishInput): Promise<PublishResult> {
  const { token, publicationId } = config.publishers.hashnode;

  if (!token || !publicationId) {
    return {
      platform: 'hashnode',
      success: false,
      publishedUrl: null,
      error: 'HASHNODE_TOKEN 또는 HASHNODE_PUBLICATION_ID가 설정되지 않았습니다.',
      publishedAt: null,
    };
  }

  try {
    console.log('[Hashnode] 발행 시작...');

    const response = await fetch(HASHNODE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        query: PUBLISH_POST_MUTATION,
        variables: {
          input: {
            publicationId,
            title: input.title,
            contentMarkdown: input.contentMarkdown,
            tags: input.tags.slice(0, 5).map((tag) => ({ name: tag, slug: tag.toLowerCase().replace(/\s+/g, '-') })),
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Hashnode API 오류: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as HashnodePublishResponse;

    if (data.errors?.length) {
      throw new Error(`Hashnode GraphQL 오류: ${data.errors[0].message}`);
    }

    const post = data.data?.publishPost?.post;
    if (!post) {
      throw new Error('Hashnode 응답에서 post 데이터를 찾을 수 없습니다.');
    }

    const publishedAt = new Date().toISOString();
    console.log(`[Hashnode] 발행 성공: ${post.url}`);

    return {
      platform: 'hashnode',
      success: true,
      publishedUrl: post.url,
      error: null,
      publishedAt,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Hashnode] 발행 실패: ${msg}`);
    return {
      platform: 'hashnode',
      success: false,
      publishedUrl: null,
      error: msg,
      publishedAt: null,
    };
  }
}
