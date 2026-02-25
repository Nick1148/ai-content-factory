/**
 * 발행 모듈 공통 타입 정의
 */

import type { PublishPlatform } from '../database/types.js';

export interface PublishInput {
  title: string;
  contentMarkdown: string;
  tags: string[];
  canonicalUrl?: string;
}

export interface PublishResult {
  platform: PublishPlatform;
  success: boolean;
  publishedUrl: string | null;
  error: string | null;
  publishedAt: string | null;
}
