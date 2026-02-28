/**
 * 논문읽어주는AI - 중앙 설정
 * 환경변수로 모든 API 키와 설정을 관리
 */

export const config = {
  // AI APIs
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    claudeApiKey: process.env.CLAUDE_API_KEY ?? '',
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
