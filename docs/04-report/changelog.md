# AI Content Factory Changelog

---

## [2026-03-03] - 전체 프로젝트 PDCA 완료 (Strategy A v0.1.0)

### Added
- AI 도구 자동 수집 파이프라인 (Product Hunt, GitHub Trending)
- arXiv 논문 수집 + Gemini API 한국어 해설 파이프라인
- Supabase 데이터베이스 (tools, reviews, publish_logs, newsletter_subscribers, papers, paper_explanations)
- Hono API 서버 (포트 3001, GET /api/tools, GET /api/papers, POST /api/subscribe)
- Next.js 16 웹사이트 9개 페이지 (메인, 도구, 논문, 카테고리, 뉴스레터, 대시보드, 프라이싱)
- 대시보드 페이지 - 실시간 통계 4개 카드 + 발행 로그
- 프라이싱 페이지 - 3-Tier 모델 (Community $0 / Pro $29 / Agency $300-500)
- GA4 Analytics 컴포넌트
- SEO 최적화 - JSON-LD (SoftwareApplication, ScholarlyArticle), OpenGraph, sitemap, robots
- CI/CD 자동화 3개 워크플로우 (일일 파이프라인, Vercel 배포, 수동 실행)
- Mock 데이터 폴백 - DB 없이도 웹사이트 완전 동작

### Changed
- `.env.example` 웹 전용 변수 4개 추가 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`)
- `src/pipeline.ts` url 하드코딩(`url: ''`) → 수집된 원본 URL 전달
- `.github/workflows/deploy-web.yml` `NEXT_PUBLIC_GA_MEASUREMENT_ID` 및 `NEXT_PUBLIC_SITE_URL` 환경변수 추가
- `src/ai/gemini.ts` 카테고리 6개 → 10개 확장 (백엔드-프론트엔드 동기화)
- `src/ai/review-generator.ts` 폴백 rating 5.0 → 3.0 (중간값)
- `web/src/components/Footer.tsx` Papers 네비게이션 링크 추가

### Fixed
- `web/src/app/papers/page.tsx` 빈 논문 목록 시 안내 메시지 없음 → "논문이 없습니다" 메시지 추가
- `web/src/app/pricing/page.tsx` 깨진 링크 3건 수정 (GitHub URL, Pro 버튼 href, 문의 이메일 mailto)
- 브랜딩 잔존값 전체 정리 ("AI Tool Radar" → "AI Content Factory")
- Rating scale 표시 /10 → /5 통일

---

## [2026-02-28] - Strategy A Part 4 기술 구현 완료 (config PDCA)

### Added
- 뉴스레터 실제 API 연결 (Next.js Server Action + Supabase upsert)
- GA4 Analytics 컴포넌트 (GoogleAnalytics.tsx)
- 대시보드 페이지 (web/src/app/dashboard/page.tsx)
- 프라이싱 페이지 (web/src/app/pricing/page.tsx)
- README.md 전면 개편 (385줄 - 아키텍처 다이어그램, 빠른 시작, 무료 비용 분석, 로드맵)
- LICENSE (MIT), CONTRIBUTING.md, GitHub Issue 템플릿

### Changed
- Canonical URL - 환경변수 `SITE_URL` 동적 적용 (platform-adapter.ts)
- Sitemap - Mock 배열 → Supabase 비동기 쿼리
- `.env.example` - `SITE_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `WEB_URL`, `PORT`, `RESEND_API_KEY` 추가

### Fixed
- 브랜딩 8곳 수정 (뉴스레터 페이지, 템플릿, 발신 도메인, robots.txt 등)
- Rating scale /10 → /5 (platform-adapter.ts 5곳)
