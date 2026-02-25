/**
 * arXiv API 데이터 수집기
 * 최근 AI/ML 관련 논문을 수집합니다.
 * API 문서: https://info.arxiv.org/help/api/index.html
 */

import type { ArxivPaper } from './types.js';

const ARXIV_API = 'http://export.arxiv.org/api/query';

const AI_CATEGORIES = ['cs.AI', 'cs.CL', 'cs.CV', 'cs.LG', 'cs.MA'];

const CATEGORY_WEIGHTS: Record<string, number> = {
  'cs.AI': 1.0,
  'cs.CL': 0.9,
  'cs.CV': 0.8,
  'cs.LG': 0.85,
  'cs.MA': 0.7,
};

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  // arXiv 검색용 날짜 포맷: YYYYMMDD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractAllTags(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function extractAttribute(xml: string, tag: string, attr: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, 'g');
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

function extractLinks(entryXml: string): { pdfUrl: string; arxivUrl: string } {
  let pdfUrl = '';
  let arxivUrl = '';

  const linkRegex = /<link[^>]*href="([^"]*)"[^>]*(?:title="([^"]*)")?[^>]*\/?>/g;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(entryXml)) !== null) {
    const href = match[1];
    const title = match[2] ?? '';
    if (title === 'pdf' || href.includes('/pdf/')) {
      pdfUrl = href;
    } else if (href.includes('/abs/')) {
      arxivUrl = href;
    }
  }

  return { pdfUrl, arxivUrl };
}

function calculateScore(paper: { categories: string[]; authors: string[]; abstract: string }): number {
  let score = 0;

  // 카테고리 관련성 점수 (최대 10점)
  for (const cat of paper.categories) {
    const weight = CATEGORY_WEIGHTS[cat] ?? 0;
    score += weight * 5;
  }
  score = Math.min(score, 10);

  // 저자 수 점수 (최대 5점, 많을수록 대규모 연구로 간주)
  const authorScore = Math.min(paper.authors.length / 4, 5);
  score += authorScore;

  // Abstract 길이 점수 (최대 5점, 상세할수록 높은 점수)
  const abstractScore = Math.min(paper.abstract.length / 400, 5);
  score += abstractScore;

  return Math.round(score * 10) / 10;
}

function parseEntries(xml: string): ArxivPaper[] {
  const papers: ArxivPaper[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch: RegExpExecArray | null;

  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    const entry = entryMatch[1];

    const id = extractTag(entry, 'id');
    const title = extractTag(entry, 'title').replace(/\s+/g, ' ');
    const abstract = extractTag(entry, 'summary').replace(/\s+/g, ' ');
    const published = extractTag(entry, 'published');

    const authors = extractAllTags(entry, 'name');
    const categories = extractAttribute(entry, 'category', 'term');
    const { pdfUrl, arxivUrl } = extractLinks(entry);

    const paper: ArxivPaper = {
      id,
      title,
      abstract,
      authors,
      categories,
      publishedDate: published,
      pdfUrl: pdfUrl || id.replace('/abs/', '/pdf/') + '.pdf',
      arxivUrl: arxivUrl || id,
      score: 0,
    };

    paper.score = calculateScore(paper);
    papers.push(paper);
  }

  return papers;
}

async function fetchArxivPapers(category: string, maxResults: number = 50): Promise<string> {
  const startDate = getDateDaysAgo(3);
  const endDate = getDateDaysAgo(0);

  const searchQuery = `cat:${category}`;
  const url =
    `${ARXIV_API}?search_query=${encodeURIComponent(searchQuery)}` +
    `&sortBy=submittedDate&sortOrder=descending` +
    `&start=0&max_results=${maxResults}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`arXiv API 오류: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

export async function collectFromArxiv(): Promise<ArxivPaper[]> {
  const allPapers: ArxivPaper[] = [];
  const seen = new Set<string>();
  const errors: string[] = [];

  console.log('[arXiv] 수집 시작...');

  for (const category of AI_CATEGORIES) {
    try {
      const xml = await fetchArxivPapers(category, 30);
      const papers = parseEntries(xml);

      // 최근 3일 필터링
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      for (const paper of papers) {
        const pubDate = new Date(paper.publishedDate);
        if (pubDate >= threeDaysAgo && !seen.has(paper.id)) {
          seen.add(paper.id);
          allPapers.push(paper);
        }
      }

      console.log(`[arXiv] 카테고리 "${category}": ${papers.length}개 조회, 최근 3일 ${allPapers.length - seen.size + seen.size}개`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`[arXiv/${category}] ${msg}`);
      console.error(`[arXiv] 카테고리 "${category}" 수집 실패:`, msg);
    }
  }

  // score 기준 내림차순 정렬
  allPapers.sort((a, b) => b.score - a.score);

  console.log(`[arXiv] 총 ${allPapers.length}개 논문 수집 완료 (에러: ${errors.length}건)`);

  if (errors.length > 0) {
    errors.forEach((e) => console.warn(`  - ${e}`));
  }

  return allPapers;
}
