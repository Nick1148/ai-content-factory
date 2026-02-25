/**
 * Supabase 클라이언트 초기화
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import type { Database } from './types.js';

const { url, anonKey } = config.supabase;

if (!url || !anonKey) {
  console.warn('[Database] SUPABASE_URL 또는 SUPABASE_ANON_KEY가 설정되지 않았습니다.');
}

export const supabase = createClient<Database>(url, anonKey);

export { type Database } from './types.js';
