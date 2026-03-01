/**
 * Supabase DB 스키마 상태 확인 스크립트
 * 6개 테이블의 존재 여부와 데이터 건수를 확인합니다.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL 또는 SUPABASE_ANON_KEY가 .env에 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES = [
  'tools',
  'reviews',
  'publish_logs',
  'newsletter_subscribers',
  'papers',
  'paper_explanations',
] as const;

async function checkTable(table: string): Promise<{ exists: boolean; count: number }> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { exists: false, count: 0 };
    }
    return { exists: true, count: count ?? 0 };
  } catch {
    return { exists: false, count: 0 };
  }
}

async function main() {
  console.log('============================================');
  console.log('  Supabase DB 스키마 상태 확인');
  console.log(`  URL: ${SUPABASE_URL}`);
  console.log('============================================\n');

  let allExist = true;
  let hasData = false;

  for (const table of TABLES) {
    const result = await checkTable(table);
    const status = result.exists ? '✅' : '❌';
    const countStr = result.exists ? `${result.count}건` : '테이블 없음';
    console.log(`  ${status} ${table.padEnd(25)} ${countStr}`);

    if (!result.exists) allExist = false;
    if (result.count > 0) hasData = true;
  }

  console.log('\n--------------------------------------------');

  if (!allExist) {
    console.log('⚠️  일부 테이블이 없습니다.');
    console.log('   → Supabase Dashboard > SQL Editor에서 src/database/schema.sql을 실행하세요.');
    process.exitCode = 1;
  } else if (!hasData) {
    console.log('✅ 모든 테이블이 존재합니다. (데이터 없음)');
    console.log('   → npm run pipeline 으로 첫 데이터를 생성하세요.');
  } else {
    console.log('✅ 모든 테이블이 존재하고 데이터가 있습니다.');
  }

  console.log('============================================\n');
}

main();
