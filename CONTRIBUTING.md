# Contributing to AI Content Factory

AI Content Factory에 기여해 주셔서 감사합니다!

## Getting Started

1. 이 레포를 fork하세요
2. feature 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 push하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## Development Setup

```bash
# 레포 클론
git clone https://github.com/your-username/ai-content-factory.git
cd ai-content-factory

# 의존성 설치
npm install
cd web && npm install && cd ..

# 환경변수 설정
cp .env.example .env
cp web/.env.local.example web/.env.local

# 개발 서버 실행
npm run dev          # 백엔드 API 서버
cd web && npm run dev # 프론트엔드
```

## Commit Convention

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 스타일 (포매팅 등)
- `refactor:` 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드, CI/CD 등

## Code Style

- TypeScript strict mode
- ESM (import/export)
- 파일명: kebab-case
- 함수명/변수명: camelCase
- 타입명: PascalCase
- 주석 및 로그: 한국어

## Reporting Issues

버그 리포트나 기능 요청은 [GitHub Issues](https://github.com/your-username/ai-content-factory/issues)를 사용해주세요.

## License

이 프로젝트에 기여하면, 기여한 코드는 [MIT License](LICENSE) 하에 배포됩니다.
