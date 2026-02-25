/**
 * 콘텐츠 관련 타입 정의
 */

export type Platform = 'medium' | 'devto' | 'hashnode' | 'wordpress';

export type ToolCategory =
  | 'AI Agent'
  | 'Image Gen'
  | 'Code'
  | 'Productivity'
  | 'Data'
  | 'Other';

export interface GeneratedReview {
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  alternatives: string[];
  rating: number;
  content: string;
}

export interface AdaptedContent {
  title: string;
  content: string;
  tags: string[];
  canonicalUrl: string;
  excerpt: string;
}

export interface ProcessedTool {
  toolName: string;
  category: ToolCategory;
  trendScore: number;
  review: GeneratedReview;
  platformContents: Record<Platform, AdaptedContent>;
}

export type ProcessedContent = ProcessedTool;

export interface PaperExplanation {
  paperId: string;
  titleOriginal: string;
  titleKo: string;
  tldr: string;
  summary: string;
  keyFindings: string[];
  whyItMatters: string;
  technicalDetail: string;
}

export interface ProcessedPaper {
  paper: import('../collectors/types.js').ArxivPaper;
  explanation: PaperExplanation;
}
