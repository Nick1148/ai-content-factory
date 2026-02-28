/**
 * Supabase 클라이언트 초기화
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import type { Database } from './types.js';

const { url, anonKey, serviceRoleKey } = config.supabase;

if (!url || !anonKey) {
  console.warn('[Database] SUPABASE_URL 또는 SUPABASE_ANON_KEY가 설정되지 않았습니다.');
}

// 파이프라인은 service_role 키로 RLS 우회, API 서버는 anon 키 사용
const activeKey = serviceRoleKey || anonKey;
export const supabase = createClient<Database>(url, activeKey);

export { type Database } from './types.js';
