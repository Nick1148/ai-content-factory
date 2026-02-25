/**
 * GitHub REST API 데이터 수집기
 * Trending AI/ML 레포지토리를 수집합니다.
 */

import { config } from '../config/index.js';
import type { GitHubRepo, CollectedTool } from './types.js';

const AI_SEARCH_QUERIES = [
  'ai tool',
  'machine learning',
  'llm',
  'generative ai',
  'deep learning',
];

function repoToCollectedTool(repo: GitHubRepo): CollectedTool {
  return {
    name: repo.name,
    tagline: repo.description?.slice(0, 120) ?? '',
    description: repo.description ?? '',
    url: repo.html_url,
    thumbnail: repo.owner.avatar_url ?? null,
    votes: 0,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    owner: repo.owner.login,
    source: 'github',
    collectedAt: new Date().toISOString(),
  };
}

function getDateWeekAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

async function searchRepos(query: string): Promise<GitHubRepo[]> {
  const { token, apiUrl } = config.github;
  const weekAgo = getDateWeekAgo();

  const searchQuery = `${query} stars:>100 created:>${weekAgo}`;
  const url = `${apiUrl}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=30`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API 오류: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { items: GitHubRepo[] };
  return data.items ?? [];
}

export async function collectFromGitHub(): Promise<{
  tools: CollectedTool[];
  errors: string[];
}> {
  const tools: CollectedTool[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  console.log('[GitHub] 수집 시작...');

  for (const query of AI_SEARCH_QUERIES) {
    try {
      const repos = await searchRepos(query);
      for (const repo of repos) {
        const key = repo.full_name;
        if (!seen.has(key)) {
          seen.add(key);
          tools.push(repoToCollectedTool(repo));
        }
      }
      console.log(`[GitHub] 쿼리 "${query}": ${repos.length}개 수집`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[GitHub/${query}] ${msg}`);
      console.error(`[GitHub] 쿼리 "${query}" 수집 실패:`, msg);
    }
  }

  console.log(`[GitHub] 총 ${tools.length}개 레포지토리 수집 완료 (에러: ${errors.length}건)`);
  return { tools, errors };
}
