/**
 * 데이터베이스 저장소 모듈
 * Supabase를 통해 papers, paper_explanations, newsletter_subscribers 테이블에 대한 CRUD 작업을 수행합니다.
 */

import { supabase } from './client.js';
import type {
  Paper,
  PaperInsert,
  PaperExplanationRow,
  PaperExplanationInsert,
  NewsletterSubscriber,
} from './types.js';

/**
 * papers 테이블에 논문을 upsert합니다.
 * arxiv_id 기준으로 기존 레코드가 있으면 업데이트, 없으면 삽입합니다.
 */
export async function savePaper(paper: PaperInsert): Promise<Paper | null> {
  const { data, error } = await supabase
    .from('papers')
    .upsert(paper as any, { onConflict: 'arxiv_id' })
    .select()
    .single();

  if (error) {
    console.error(`[DB] 논문 저장 실패 (${paper.title}):`, error.message);
    return null;
  }

  return data as Paper;
}

/**
 * paper_explanations 테이블에 해설을 삽입합니다.
 */
export async function savePaperExplanation(
  explanation: PaperExplanationInsert,
): Promise<PaperExplanationRow | null> {
  const { data, error } = await supabase
    .from('paper_explanations')
    .insert(explanation as any)
    .select()
    .single();

  if (error) {
    console.error(`[DB] 논문 해설 저장 실패 (paper_id: ${explanation.paper_id}):`, error.message);
    return null;
  }

  return data as PaperExplanationRow;
}

/**
 * 최근 N일 이내 논문 목록을 조회합니다.
 */
export async function getRecentPapers(days: number): Promise<Paper[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('papers')
    .select('*')
    .gte('created_at', since.toISOString())
    .order('score', { ascending: false });

  if (error) {
    console.error(`[DB] 최근 논문 조회 실패:`, error.message);
    return [];
  }

  return (data ?? []) as Paper[];
}

/**
 * newsletter_subscribers에서 active 상태인 구독자 이메일을 조회합니다.
 */
export async function getSubscribers(): Promise<string[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'active');

  if (error) {
    console.error(`[DB] 구독자 조회 실패:`, error.message);
    return [];
  }

  return ((data ?? []) as Pick<NewsletterSubscriber, 'email'>[]).map((s) => s.email);
}
