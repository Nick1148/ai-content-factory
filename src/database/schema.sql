-- AI Content Factory - Supabase 데이터베이스 스키마
-- 실행 순서: tools -> reviews -> publish_logs -> newsletter_subscribers

-- 1. tools: 수집된 AI 도구 정보
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'uncategorized',
  source TEXT NOT NULL CHECK (source IN ('producthunt', 'github')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  votes_count INTEGER NOT NULL DEFAULT 0,
  stars_count INTEGER NOT NULL DEFAULT 0,
  forks_count INTEGER NOT NULL DEFAULT 0,
  language TEXT,
  topics TEXT[] NOT NULL DEFAULT '{}',
  owner TEXT NOT NULL DEFAULT '',
  trend_score REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tools_source ON tools(source);
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_trend_score ON tools(trend_score DESC);
CREATE INDEX idx_tools_created_at ON tools(created_at DESC);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 2. reviews: AI가 생성한 도구 리뷰
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  pros JSONB NOT NULL DEFAULT '[]',
  cons JSONB NOT NULL DEFAULT '[]',
  use_cases JSONB NOT NULL DEFAULT '[]',
  alternatives JSONB NOT NULL DEFAULT '[]',
  rating REAL CHECK (rating >= 0 AND rating <= 5),
  content_markdown TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- 3. publish_logs: 플랫폼별 발행 이력
CREATE TABLE IF NOT EXISTS publish_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('medium', 'devto', 'hashnode', 'wordpress')),
  published_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')) DEFAULT 'failed',
  published_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_publish_logs_review_id ON publish_logs(review_id);
CREATE INDEX idx_publish_logs_platform ON publish_logs(platform);
CREATE INDEX idx_publish_logs_status ON publish_logs(status);

-- 4. newsletter_subscribers: 뉴스레터 구독자
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('active', 'unsubscribed')) DEFAULT 'active'
);

CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- 5. papers: arXiv 논문 정보
CREATE TABLE IF NOT EXISTS papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arxiv_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_ko TEXT,
  abstract TEXT NOT NULL DEFAULT '',
  authors JSONB NOT NULL DEFAULT '[]',
  categories JSONB NOT NULL DEFAULT '[]',
  published_date TIMESTAMPTZ,
  pdf_url TEXT NOT NULL DEFAULT '',
  arxiv_url TEXT NOT NULL DEFAULT '',
  score REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_papers_arxiv_id ON papers(arxiv_id);
CREATE INDEX idx_papers_score ON papers(score DESC);
CREATE INDEX idx_papers_created_at ON papers(created_at DESC);

-- 6. paper_explanations: AI가 생성한 논문 한국어 해설
CREATE TABLE IF NOT EXISTS paper_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  tldr TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  key_findings JSONB NOT NULL DEFAULT '[]',
  why_it_matters TEXT NOT NULL DEFAULT '',
  technical_detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_paper_explanations_paper_id ON paper_explanations(paper_id);
CREATE INDEX idx_paper_explanations_created_at ON paper_explanations(created_at DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_explanations ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (tools, reviews, papers, paper_explanations)
CREATE POLICY "tools_public_read" ON tools FOR SELECT USING (true);
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "papers_public_read" ON papers FOR SELECT USING (true);
CREATE POLICY "paper_explanations_public_read" ON paper_explanations FOR SELECT USING (true);

-- service_role만 쓰기 가능
CREATE POLICY "tools_service_write" ON tools FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "reviews_service_write" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "publish_logs_service_all" ON publish_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "newsletter_service_all" ON newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "papers_service_write" ON papers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "paper_explanations_service_write" ON paper_explanations FOR ALL USING (auth.role() = 'service_role');
