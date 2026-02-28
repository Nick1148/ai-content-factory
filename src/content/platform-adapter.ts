/**
 * 플랫폼별 콘텐츠 변형 모듈
 * 하나의 리뷰를 각 플랫폼 특성에 맞게 변환합니다.
 */

import type { GeneratedReview, AdaptedContent, Platform } from './types.js';

const SITE_URL = process.env.SITE_URL || 'https://ai-content-factory.vercel.app';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function adaptForMedium(review: GeneratedReview): AdaptedContent {
  const slug = slugify(review.title);

  // Medium: 스토리텔링, 개인 경험 느낌, 이미지 강조
  const content = `# ${review.title}

> ${review.summary}

---

개발자로서 새로운 AI 도구를 발견하는 것은 언제나 설레는 일입니다. 오늘 소개할 도구를 처음 접했을 때, 저는 이것이 우리의 워크플로우를 어떻게 바꿀 수 있을지 기대가 되었습니다.

${review.content}

---

## 핵심 정리

**장점:**
${review.pros.map((p) => `- ${p}`).join('\n')}

**단점:**
${review.cons.map((c) => `- ${c}`).join('\n')}

**평점: ${review.rating}/5**

---

*이 리뷰가 도움이 되셨다면 클랩(clap)과 팔로우를 부탁드립니다. 더 많은 AI 도구 리뷰를 매주 업데이트합니다.*

---

### 관련 도구
${review.alternatives.length > 0 ? review.alternatives.map((a) => `- ${a}`).join('\n') : '- 곧 업데이트 예정'}`;

  const tags = ['ai', 'developer-tools', 'productivity', 'technology', 'artificial-intelligence'];

  return {
    title: review.title,
    content,
    tags,
    canonicalUrl: `${SITE_URL}/tools/${slug}`,
    excerpt: review.summary.slice(0, 150),
  };
}

function adaptForDevTo(review: GeneratedReview): AdaptedContent {
  const slug = slugify(review.title);

  // Dev.to: 코드 예시 포함, 튜토리얼 형식, 태그 활용
  const content = `---
title: "${review.title}"
published: false
tags: ai, devtools, tutorial, productivity
---

## TL;DR

${review.summary}

**평점: ${review.rating}/5**

---

${review.content}

## 빠른 시작 가이드

\`\`\`bash
# 설치 및 시작 (도구별 상이)
# 공식 문서를 참조하세요
\`\`\`

## 장점 vs 단점

| 장점 | 단점 |
|------|------|
${(() => {
  const maxLen = Math.max(review.pros.length, review.cons.length);
  const rows: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    const pro = review.pros[i] ?? '';
    const con = review.cons[i] ?? '';
    rows.push(`| ${pro} | ${con} |`);
  }
  return rows.join('\n');
})()}

## 활용 사례

${review.useCases.map((uc, i) => `### ${i + 1}. ${uc}`).join('\n\n')}

## 대안 도구

${review.alternatives.length > 0 ? review.alternatives.map((a) => `- ${a}`).join('\n') : '- 곧 업데이트 예정'}

---

> 이 글이 유용했다면 좋아요와 북마크를 부탁드립니다!`;

  return {
    title: review.title,
    content,
    tags: ['ai', 'devtools', 'tutorial', 'productivity'],
    canonicalUrl: `${SITE_URL}/tools/${slug}`,
    excerpt: review.summary.slice(0, 150),
  };
}

function adaptForHashnode(review: GeneratedReview): AdaptedContent {
  const slug = slugify(review.title);

  // Hashnode: 심화 기술 분석, 아키텍처 다이어그램 설명
  const content = `# ${review.title}

${review.summary}

---

## 기술 아키텍처 분석

이 도구의 내부 구조와 기술적 접근 방식을 깊이 있게 살펴보겠습니다.

${review.content}

## 기술 스택 및 아키텍처

\`\`\`
┌─────────────────────────────────────────┐
│              사용자 인터페이스             │
├─────────────────────────────────────────┤
│              API / SDK 레이어            │
├─────────────────────────────────────────┤
│         AI/ML 엔진 (핵심 로직)           │
├─────────────────────────────────────────┤
│           데이터 저장 / 캐시              │
└─────────────────────────────────────────┘
\`\`\`

> 위 다이어그램은 일반적인 AI 도구의 아키텍처입니다. 실제 구현은 도구마다 다를 수 있습니다.

## 성능 및 확장성

### 장점 (심화 분석)
${review.pros.map((p) => `- **${p}**: 기술적 관점에서의 이점`).join('\n')}

### 한계점 (심화 분석)
${review.cons.map((c) => `- **${c}**: 개선이 필요한 영역`).join('\n')}

## 실무 적용 시나리오

${review.useCases.map((uc, i) => `### 시나리오 ${i + 1}: ${uc}\n\n실무에서 이 도구를 활용할 때 고려해야 할 기술적 요소들을 분석합니다.`).join('\n\n')}

## 대안 기술 비교

${review.alternatives.length > 0 ? review.alternatives.map((a) => `- **${a}**`).join('\n') : '- 곧 비교 분석 업데이트 예정'}

## 종합 평가

**평점: ${review.rating}/5**

---

*이 글은 AI Content Factory에서 작성되었습니다.*`;

  return {
    title: review.title,
    content,
    tags: ['ai', 'architecture', 'deep-dive', 'developer-tools', 'tech-analysis'],
    canonicalUrl: `${SITE_URL}/tools/${slug}`,
    excerpt: review.summary.slice(0, 150),
  };
}

function adaptForWordPress(review: GeneratedReview): AdaptedContent {
  const slug = slugify(review.title);

  // WordPress: SEO 키워드 최적화, H2/H3 구조화
  const content = `<h1>${review.title}</h1>

<p><strong>${review.summary}</strong></p>

<p>최신 AI 도구 리뷰를 찾고 계신가요? 이 글에서는 최근 주목받고 있는 AI 도구를 심층 분석하고, 실제 사용 후기와 함께 장단점을 정리했습니다.</p>

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

${review.content.replace(/^## /gm, '<h2>').replace(/^### /gm, '<h3>').replace(/<h2>(.+)/gm, '<h2>$1</h2>').replace(/<h3>(.+)/gm, '<h3>$1</h3>')}

<h2>장점 요약</h2>
<ul>
${review.pros.map((p) => `<li>${p}</li>`).join('\n')}
</ul>

<h2>단점 요약</h2>
<ul>
${review.cons.map((c) => `<li>${c}</li>`).join('\n')}
</ul>

<h2>추천 활용 사례</h2>
<ol>
${review.useCases.map((uc) => `<li>${uc}</li>`).join('\n')}
</ol>

<h2>대안 AI 도구</h2>
<ul>
${review.alternatives.length > 0 ? review.alternatives.map((a) => `<li><strong>${a}</strong></li>`).join('\n') : '<li>곧 업데이트 예정</li>'}
</ul>

<h2>최종 평점</h2>
<p><strong>${review.rating}/5</strong> - ${review.rating >= 4 ? '강력 추천' : review.rating >= 3 ? '추천' : '보통'}</p>

<p><em>이 리뷰는 AI Content Factory에서 작성되었습니다. 최신 AI 도구 리뷰를 받아보려면 뉴스레터를 구독하세요.</em></p>

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<p>관련 키워드: AI 도구, 인공지능, 개발자 도구, AI 리뷰, 생산성 도구, 최신 AI 트렌드</p>`;

  return {
    title: `${review.title} | AI 도구 리뷰 2026`,
    content,
    tags: ['AI 도구', '인공지능', '개발자 도구', 'AI 리뷰', '생산성'],
    canonicalUrl: `${SITE_URL}/tools/${slug}`,
    excerpt: `${review.summary.slice(0, 140)}... 평점: ${review.rating}/5`,
  };
}

const adapters: Record<Platform, (review: GeneratedReview) => AdaptedContent> = {
  medium: adaptForMedium,
  devto: adaptForDevTo,
  hashnode: adaptForHashnode,
  wordpress: adaptForWordPress,
};

export function adaptForPlatform(review: GeneratedReview, platform: Platform): AdaptedContent {
  const adapter = adapters[platform];
  return adapter(review);
}
