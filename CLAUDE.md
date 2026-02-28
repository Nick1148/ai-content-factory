# 논문읽어주는AI

매일 최신 AI/ML 논문을 arXiv에서 자동 수집하고, AI가 한국어로 해설하여 웹사이트와 뉴스레터로 제공하는 서비스입니다.

## 프로젝트 구조

```
teams/
├── src/                     # 백엔드 파이프라인 (TypeScript)
│   ├── collectors/          # 데이터 수집 (arXiv)
│   ├── ai/                  # AI 논문 해설 생성 (Gemini API)
│   ├── content/             # 콘텐츠 타입 정의
│   ├── database/            # Supabase 클라이언트 및 repository
│   ├── publishers/          # 뉴스레터 발송 모듈
│   ├── config/              # 환경설정
│   ├── pipeline.ts          # 메인 파이프라인
│   └── index.ts             # API 서버 엔트리포인트
├── web/                     # 프론트엔드 (Next.js 16 + Tailwind CSS)
│   └── src/
│       ├── app/             # App Router 페이지
│       ├── components/      # React 컴포넌트
│       └── lib/             # 데이터 및 타입
├── infra/                   # 인프라 설정
├── docs/                    # 문서
├── .github/workflows/       # GitHub Actions CI/CD
│   ├── daily-pipeline.yml   # 매일 KST 08:00 논문 파이프라인 자동 실행
│   ├── deploy-web.yml       # web/ 변경 시 Vercel 자동 배포
│   └── manual-pipeline.yml  # 수동 실행
├── package.json             # 루트 패키지 (파이프라인)
├── tsconfig.json
├── .env.example             # 환경변수 템플릿
└── CLAUDE.md                # 이 파일
```

## 기술 스택

- **백엔드**: TypeScript, tsx, Hono (API 서버)
- **프론트엔드**: Next.js 16, React 19, Tailwind CSS 4
- **데이터베이스**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **배포**: Vercel (웹), GitHub Actions (파이프라인)

## 환경변수 설정

```bash
cp .env.example .env
```

`.env.example`에 각 키의 발급 URL이 주석으로 안내되어 있습니다. 주요 항목:

- `GEMINI_API_KEY` - Google Gemini API
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` - Supabase
- `RESEND_API_KEY` - 이메일 발송 (Resend)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 논문 파이프라인 실행
npm run pipeline

# 개별 단계 실행
npm run collect     # arXiv 논문 수집만
npm run generate    # AI 해설 생성만

# API 서버 개발 모드
npm run dev

# 웹사이트 개발 서버
cd web && npm run dev
```

## 파이프라인 흐름

1. **수집** (`npm run collect`): arXiv API에서 최신 AI/ML 논문 수집
2. **해설** (`npm run generate`): Gemini API로 한국어 해설 생성 (5분 이해 요약, 핵심 발견, 기술 심화)
3. **저장**: Supabase에 논문 정보 및 해설 저장
4. **발송**: 뉴스레터 구독자에게 이메일 발송

## 배포

### 웹사이트 (Vercel)

1. Vercel에 프로젝트 연결 (root directory: `web`)
2. GitHub Secrets에 `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` 설정
3. main 브랜치에 push하면 자동 배포 (web/ 변경 시에만)

### 파이프라인 (GitHub Actions)

1. GitHub repo Settings > Secrets에 `.env.example`의 모든 변수 등록
2. 매일 KST 08:00에 자동 실행, 또는 Actions 탭에서 수동 실행 가능

## 코딩 컨벤션

- TypeScript strict mode
- ESM (import/export)
- 파일명: kebab-case
- 함수명/변수명: camelCase
- 타입명: PascalCase
- 주석 및 로그: 한국어
