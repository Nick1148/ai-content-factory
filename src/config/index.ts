/**
 * AI Content Factory - 중앙 설정
 * 환경변수로 모든 API 키와 설정을 관리
 */

export const config = {
  // Product Hunt API
  productHunt: {
    token: process.env.PRODUCTHUNT_TOKEN ?? '',
    apiUrl: 'https://api.producthunt.com/v2/api/graphql',
  },

  // GitHub API
  github: {
    token: process.env.GITHUB_TOKEN ?? '',
    apiUrl: 'https://api.github.com',
  },

  // AI APIs (Claude Code Max + Google Pro에 포함)
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    claudeApiKey: process.env.CLAUDE_API_KEY ?? '',
  },

  // Publishers
  publishers: {
    medium: {
      token: process.env.MEDIUM_TOKEN ?? '',
    },
    devto: {
      apiKey: process.env.DEVTO_API_KEY ?? '',
    },
    hashnode: {
      token: process.env.HASHNODE_TOKEN ?? '',
      publicationId: process.env.HASHNODE_PUBLICATION_ID ?? '',
    },
    wordpress: {
      url: process.env.WORDPRESS_URL ?? '',
      username: process.env.WORDPRESS_USERNAME ?? '',
      password: process.env.WORDPRESS_APP_PASSWORD ?? '',
    },
  },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    anonKey: process.env.SUPABASE_ANON_KEY ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  },

  // Resend (이메일)
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? '',
  },
} as const;
