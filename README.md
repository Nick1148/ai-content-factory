<div align="center">

# AI Content Factory

**Fully automated AI tool discovery, review generation, and multi-platform publishing system.**

Collect trending AI tools & papers daily. Generate Korean-language reviews with Gemini AI. Publish everywhere -- automatically. All for **$0/month**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![GitHub Stars](https://img.shields.io/github/stars/Nick1148/ai-content-factory?style=social)](https://github.com/Nick1148/ai-content-factory)
[![GitHub Issues](https://img.shields.io/github/issues/Nick1148/ai-content-factory)](https://github.com/Nick1148/ai-content-factory/issues)

[Live Demo](https://ai-content-factory.vercel.app) | [Quick Start](#-quick-start) | [Documentation](#-project-structure) | [Contributing](#-contributing)

</div>

---

## Why AI Content Factory?

Running a tech content channel is repetitive: find tools, research them, write reviews, format for each platform, hit publish, repeat. Every. Single. Day.

**AI Content Factory eliminates the entire workflow.** Set it up once, and it runs itself.

| | What it does |
|---|---|
| **Auto-Collect** | Scrapes Product Hunt, GitHub Trending, and arXiv daily for the latest AI tools & papers |
| **AI-Powered Reviews** | Generates in-depth Korean-language reviews, ratings, pros/cons, and use cases via Google Gemini |
| **Multi-Platform Publish** | Simultaneously publishes to Medium, DEV.to, Hashnode, and WordPress |
| **Newsletter** | Sends curated paper digests to subscribers via Resend |
| **$0 Operating Cost** | Runs entirely on free tiers -- Supabase, Vercel, GitHub Actions, Gemini API |

---

## Architecture

```
                         AI CONTENT FACTORY
  ============================================================

  DATA SOURCES                AI ENGINE              OUTPUTS
  ────────────              ────────────           ──────────

  ┌──────────────┐     ┌───────────────────┐     ┌──────────────┐
  │ Product Hunt │────>│                   │────>│   Medium     │
  └──────────────┘     │                   │     └──────────────┘
  ┌──────────────┐     │   Google Gemini   │     ┌──────────────┐
  │ GitHub       │────>│                   │────>│   DEV.to     │
  │ Trending     │     │  - Tool Reviews   │     └──────────────┘
  └──────────────┘     │  - Paper Explain  │     ┌──────────────┐
  ┌──────────────┐     │  - Ratings        │────>│  Hashnode    │
  │ arXiv Papers │────>│  - Pros/Cons      │     └──────────────┘
  └──────────────┘     │                   │     ┌──────────────┐
                       └─────────┬─────────┘────>│  WordPress   │
                                 │               └──────────────┘
                                 │               ┌──────────────┐
                                 └──────────────>│  Newsletter  │
                                 │               └──────────────┘
                                 v
                       ┌───────────────────┐     ┌──────────────┐
                       │    Supabase DB    │────>│  Next.js Web │
                       │   (PostgreSQL)    │     │  Dashboard   │
                       └───────────────────┘     └──────────────┘
```

**Pipeline runs daily at 08:00 KST via GitHub Actions** -- zero manual intervention.

---

## Features

### Phase 1: Tool Pipeline
- [x] Product Hunt API integration -- fetch daily top AI tools
- [x] GitHub Trending scraper -- discover rising repositories
- [x] Gemini AI review generation -- Korean-language, with ratings, pros/cons, alternatives
- [x] Multi-platform publishing -- Medium, DEV.to, Hashnode, WordPress
- [x] Supabase persistent storage with full CRUD API

### Phase 2: Paper Pipeline
- [x] arXiv paper collection -- latest AI/ML research
- [x] AI-powered Korean explanations -- TL;DR, key findings, technical deep-dive
- [x] Newsletter delivery -- automated email digests via Resend

### Web Dashboard
- [x] Next.js 16 + React 19 frontend with Tailwind CSS 4
- [x] Tool browsing with category filters
- [x] Paper explorer with Korean explanations
- [x] Newsletter subscription
- [x] SEO-optimized with sitemap

### Infrastructure
- [x] Hono API server (lightweight, fast)
- [x] GitHub Actions CI/CD -- daily cron + manual trigger
- [x] Vercel auto-deploy on push
- [x] TypeScript strict mode throughout

---

## Demo

**Live site:** [https://ai-content-factory.vercel.app](https://ai-content-factory.vercel.app)

---

## Quick Start

Get up and running in 5 minutes.

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Supabase](https://supabase.com/) account (free tier)
- [Google AI Studio](https://aistudio.google.com/) API key (free tier)

### 1. Clone & Install

```bash
git clone https://github.com/Nick1148/ai-content-factory.git
cd ai-content-factory
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your API keys. At minimum, you need:

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `GEMINI_API_KEY` | Yes | [Google AI Studio](https://aistudio.google.com/apikey) |
| `SUPABASE_URL` | Yes | [Supabase Dashboard](https://supabase.com/) > Settings > API |
| `SUPABASE_ANON_KEY` | Yes | Same as above |
| `PRODUCTHUNT_TOKEN` | For tools | [Product Hunt API](https://www.producthunt.com/v2/oauth/applications) |
| `GITHUB_TOKEN` | For tools | [GitHub Settings](https://github.com/settings/tokens) |
| `MEDIUM_TOKEN` | For publishing | [Medium Settings](https://medium.com/me/settings/security) |
| `DEVTO_API_KEY` | For publishing | [DEV.to Settings](https://dev.to/settings/extensions) |

### 3. Initialize Database

Run the schema in Supabase SQL Editor:

```sql
-- Copy and execute: src/database/schema.sql
```

### 4. Run the Pipeline

```bash
# Collect AI tools + generate reviews + publish
npm run pipeline

# Or run the full pipeline (tools + papers)
npm run pipeline:full
```

### 5. Start the Web Dashboard

```bash
# In a new terminal
cd web
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your dashboard.

---

## Project Structure

```
teams/
├── src/                          # Backend pipeline (TypeScript)
│   ├── collectors/               # Data collection
│   │   ├── producthunt.ts        #   Product Hunt API client
│   │   ├── github-trending.ts    #   GitHub Trending scraper
│   │   ├── arxiv.ts              #   arXiv paper fetcher
│   │   └── types.ts              #   Collector type definitions
│   ├── ai/                       # AI content generation
│   │   ├── gemini.ts             #   Gemini API client
│   │   ├── review-generator.ts   #   Tool review generation
│   │   └── paper-explainer.ts    #   Paper explanation generation
│   ├── content/                  # Content types & platform adapters
│   ├── database/                 # Supabase client & repository
│   ├── publishers/               # Publishing modules
│   │   ├── medium.ts             #   Medium publisher
│   │   ├── devto.ts              #   DEV.to publisher
│   │   ├── hashnode.ts           #   Hashnode publisher
│   │   ├── wordpress.ts          #   WordPress publisher
│   │   ├── newsletter.ts         #   Email newsletter
│   │   └── newsletter-template.ts#   HTML email template
│   ├── config/                   # Configuration
│   ├── pipeline.ts               # Main pipeline orchestrator
│   └── index.ts                  # Hono API server entry
├── web/                          # Frontend (Next.js 16)
│   └── src/
│       ├── app/                  #   App Router pages
│       ├── components/           #   React components
│       └── lib/                  #   Data layer & types
├── .github/workflows/            # GitHub Actions
│   ├── daily-pipeline.yml        #   Daily cron (KST 08:00)
│   ├── deploy-web.yml            #   Vercel auto-deploy
│   └── manual-pipeline.yml       #   Manual trigger
├── package.json                  # Root package (pipeline)
├── tsconfig.json                 # TypeScript config
└── .env.example                  # Environment template
```

---

## Pipeline Commands

| Command | Description |
|---------|-------------|
| `npm run pipeline` | Tool pipeline: collect + review + save + publish |
| `npm run pipeline:papers` | Paper pipeline: arXiv collect + AI explain + save + newsletter |
| `npm run pipeline:full` | Full pipeline: tools + papers combined |
| `npm run collect` | Data collection only |
| `npm run generate` | AI content generation only |
| `npm run publish` | Platform publishing only |
| `npm run dev` | Start API server in dev mode (port 3001) |

---

## Deployment

### Web Dashboard (Vercel)

1. Import the repo on [Vercel](https://vercel.com/) with root directory set to `web`
2. Add environment variables in Vercel project settings
3. Push to `main` -- auto-deploys via `deploy-web.yml`

### Pipeline (GitHub Actions)

1. Go to repo **Settings > Secrets and variables > Actions**
2. Add all variables from `.env.example` as repository secrets
3. Use `GH_PAT_TOKEN` (not `GITHUB_TOKEN`) for the GitHub personal access token
4. The pipeline runs automatically every day at **08:00 KST**
5. You can also trigger it manually from the **Actions** tab

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | TypeScript + tsx | Type-safe backend pipeline |
| API Server | Hono | Lightweight, fast HTTP API |
| Frontend | Next.js 16 + React 19 | Web dashboard |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Database | Supabase (PostgreSQL) | Persistent storage |
| AI | Google Gemini API | Content generation |
| CI/CD | GitHub Actions | Daily pipeline automation |
| Hosting | Vercel | Web deployment |
| Email | Resend | Newsletter delivery |

---

## Cost Breakdown

| Service | Free Tier Limit | Our Usage |
|---------|----------------|-----------|
| Supabase | 500 MB DB, 2 GB bandwidth | Well within limits |
| Vercel | 100 GB bandwidth | Static site, minimal |
| GitHub Actions | 2,000 min/month | ~5 min/day = ~150 min/month |
| Gemini API | 1,500 req/day | ~20-50 req/day |
| Resend | 3,000 emails/month | Scales with subscribers |

**Total monthly cost: $0**

---

## Roadmap

### Community (Current -- Free & Open Source)
- [x] Full pipeline automation
- [x] 4-platform publishing
- [x] Paper explanations + newsletter
- [x] Web dashboard

### Pro (Planned -- SaaS, $29-49/month)
- [ ] Hosted dashboard with analytics
- [ ] Custom data sources (Reddit, HN, Twitter/X)
- [ ] Multi-language output (EN, JP, CN)
- [ ] Content performance tracking
- [ ] Scheduling & queue management
- [ ] Slack/Discord notifications

### Agency (Planned -- Setup Service, $300-500 one-time)
- [ ] Custom installation & configuration
- [ ] Brand-specific prompt tuning
- [ ] Dedicated support
- [ ] Custom platform integrations

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/my-feature`
3. **Commit** your changes: `git commit -m "feat: add my feature"`
4. **Push** to the branch: `git push origin feat/my-feature`
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style (TypeScript strict, ESM imports)
- Use `kebab-case` for file names, `camelCase` for variables, `PascalCase` for types
- Write comments and logs in Korean (project convention)
- Test your changes locally before submitting

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Star History

<div align="center">

If this project saved you time, consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=Nick1148/ai-content-factory&type=Date)](https://star-history.com/#Nick1148/ai-content-factory&Date)

**[Give us a star on GitHub](https://github.com/Nick1148/ai-content-factory)** -- it helps others discover this project.

</div>

---

<details>
<summary><strong>Korean / &#54620;&#44397;&#50612; &#50836;&#50557;</strong></summary>

## AI Content Factory

매일 AI 도구를 자동으로 수집하고, AI가 한국어 리뷰를 생성하며, 여러 플랫폼에 동시 발행하는 완전 자동화 시스템입니다.

### 주요 기능
- **자동 수집**: Product Hunt, GitHub Trending, arXiv에서 매일 최신 AI 도구 및 논문 수집
- **AI 리뷰 생성**: Google Gemini로 한국어 리뷰, 평점, 장단점, 대안 자동 생성
- **멀티 플랫폼 발행**: Medium, DEV.to, Hashnode, WordPress 동시 발행
- **논문 해설**: arXiv AI/ML 논문을 한국어로 쉽게 해설
- **뉴스레터**: 구독자에게 자동 이메일 발송
- **월 $0 운영비**: 모든 서비스 무료 티어로 운영

### 빠른 시작
```bash
git clone https://github.com/Nick1148/ai-content-factory.git
cd ai-content-factory
npm install
cp .env.example .env   # API 키 입력
npm run pipeline:full  # 전체 파이프라인 실행
```

### 웹 대시보드
```bash
cd web && npm install && npm run dev
```
[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

### 데모 사이트
[https://ai-content-factory.vercel.app](https://ai-content-factory.vercel.app)

</details>

---

<div align="center">

Built with TypeScript, Hono, Next.js, Supabase, and Google Gemini.

**[GitHub](https://github.com/Nick1148/ai-content-factory)** | **[Live Demo](https://ai-content-factory.vercel.app)** | **[Report Bug](https://github.com/Nick1148/ai-content-factory/issues)**

</div>
