/**
 * 데이터베이스 테이블 TypeScript 타입 정의
 * schema.sql과 1:1 대응
 */

export type ToolSource = 'producthunt' | 'github';
export type PublishPlatform = 'medium' | 'devto' | 'hashnode' | 'wordpress';
export type PublishStatus = 'success' | 'failed';
export type SubscriberStatus = 'active' | 'unsubscribed';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  source: ToolSource;
  url: string;
  thumbnail_url: string | null;
  votes_count: number;
  stars_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  owner: string;
  trend_score: number;
  created_at: string;
  updated_at: string;
}

export interface ToolInsert {
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  source: ToolSource;
  url: string;
  thumbnail_url?: string | null;
  votes_count?: number;
  stars_count?: number;
  forks_count?: number;
  language?: string | null;
  topics?: string[];
  owner?: string;
  trend_score?: number;
}

export interface Review {
  id: string;
  tool_id: string;
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  use_cases: string[];
  alternatives: string[];
  rating: number | null;
  content_markdown: string;
  created_at: string;
}

export interface ReviewInsert {
  tool_id: string;
  title: string;
  summary?: string;
  pros?: string[];
  cons?: string[];
  use_cases?: string[];
  alternatives?: string[];
  rating?: number | null;
  content_markdown?: string;
}

export interface PublishLog {
  id: string;
  review_id: string;
  platform: PublishPlatform;
  published_url: string | null;
  status: PublishStatus;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface PublishLogInsert {
  review_id: string;
  platform: PublishPlatform;
  published_url?: string | null;
  status?: PublishStatus;
  published_at?: string | null;
  error_message?: string | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  subscribed_at: string;
  status: SubscriberStatus;
}

export interface NewsletterSubscriberInsert {
  email: string;
  name?: string;
  status?: SubscriberStatus;
}

export interface Paper {
  id: string;
  arxiv_id: string;
  title: string;
  title_ko: string | null;
  abstract: string;
  authors: string[];
  categories: string[];
  published_date: string | null;
  pdf_url: string;
  arxiv_url: string;
  score: number;
  created_at: string;
}

export interface PaperInsert {
  arxiv_id: string;
  title: string;
  title_ko?: string | null;
  abstract?: string;
  authors?: string[];
  categories?: string[];
  published_date?: string | null;
  pdf_url?: string;
  arxiv_url?: string;
  score?: number;
}

export interface PaperExplanationRow {
  id: string;
  paper_id: string;
  tldr: string;
  summary: string;
  key_findings: string[];
  why_it_matters: string;
  technical_detail: string;
  created_at: string;
}

export interface PaperExplanationInsert {
  paper_id: string;
  tldr?: string;
  summary?: string;
  key_findings?: string[];
  why_it_matters?: string;
  technical_detail?: string;
}

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: Tool;
        Insert: ToolInsert;
        Update: Partial<ToolInsert>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: Partial<ReviewInsert>;
        Relationships: [
          {
            foreignKeyName: 'reviews_tool_id_fkey';
            columns: ['tool_id'];
            isOneToOne: false;
            referencedRelation: 'tools';
            referencedColumns: ['id'];
          },
        ];
      };
      publish_logs: {
        Row: PublishLog;
        Insert: PublishLogInsert;
        Update: Partial<PublishLogInsert>;
        Relationships: [
          {
            foreignKeyName: 'publish_logs_review_id_fkey';
            columns: ['review_id'];
            isOneToOne: false;
            referencedRelation: 'reviews';
            referencedColumns: ['id'];
          },
        ];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: NewsletterSubscriberInsert;
        Update: Partial<NewsletterSubscriberInsert>;
        Relationships: [];
      };
      papers: {
        Row: Paper;
        Insert: PaperInsert;
        Update: Partial<PaperInsert>;
        Relationships: [];
      };
      paper_explanations: {
        Row: PaperExplanationRow;
        Insert: PaperExplanationInsert;
        Update: Partial<PaperExplanationInsert>;
        Relationships: [
          {
            foreignKeyName: 'paper_explanations_paper_id_fkey';
            columns: ['paper_id'];
            isOneToOne: false;
            referencedRelation: 'papers';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
