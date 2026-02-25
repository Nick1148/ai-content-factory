/**
 * 데이터 수집기 공통 타입 정의
 */

export type ToolSource = 'producthunt' | 'github';

export interface CollectedTool {
  name: string;
  tagline: string;
  description: string;
  url: string;
  thumbnail: string | null;
  votes: number;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  owner: string;
  source: ToolSource;
  collectedAt: string;
}

export interface ProductHuntPost {
  name: string;
  tagline: string;
  description: string;
  votesCount: number;
  url: string;
  thumbnail: { url: string } | null;
  topics: { edges: Array<{ node: { name: string } }> };
  createdAt: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export interface CollectionResult {
  tools: CollectedTool[];
  errors: string[];
  collectedAt: string;
}

export interface ArxivPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  categories: string[];
  publishedDate: string;
  pdfUrl: string;
  arxivUrl: string;
  score: number;
}
