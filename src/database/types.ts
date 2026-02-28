/**
 * 데이터베이스 테이블 TypeScript 타입 정의
 * schema.sql과 1:1 대응
 */

export type SubscriberStatus = 'active' | 'unsubscribed';

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
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
