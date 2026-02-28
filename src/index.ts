/**
 * 논문읽어주는AI - API 서버
 * Hono 기반 REST API 엔트리포인트
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { supabase } from './database/client.js';
import type { Database } from './database/types.js';

const app = new Hono();

// CORS 미들웨어
const webUrl = process.env.WEB_URL;
app.use(
  '/api/*',
  cors({
    origin: [webUrl, 'http://localhost:3000'].filter(Boolean) as string[],
  })
);

// GET /api/papers - 논문 목록
app.get('/api/papers', async (c) => {
  const limit = Number(c.req.query('limit')) || 20;
  const category = c.req.query('category');

  let query = supabase
    .from('papers')
    .select('*, paper_explanations(*)')
    .order('score', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.contains('categories', [category]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[API] 논문 목록 조회 실패:', error.message);
    return c.json({ error: '논문 목록을 불러오는데 실패했습니다.' }, 500);
  }

  return c.json(data ?? []);
});

// GET /api/papers/:id - 논문 상세
app.get('/api/papers/:id', async (c) => {
  const id = c.req.param('id');

  const { data, error } = await supabase
    .from('papers')
    .select('*, paper_explanations(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[API] 논문 상세 조회 실패:', error.message);
    return c.json({ error: '논문 정보를 불러오는데 실패했습니다.' }, 500);
  }

  if (!data) {
    return c.json({ error: '논문을 찾을 수 없습니다.' }, 404);
  }

  return c.json(data);
});

// POST /api/subscribe - 뉴스레터 구독
app.post('/api/subscribe', async (c) => {
  const body = await c.req.json();
  const { email } = body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return c.json({ error: '유효한 이메일 주소를 입력해주세요.' }, 400);
  }

  const subscriberData: Database['public']['Tables']['newsletter_subscribers']['Insert'] = {
    email,
    status: 'active',
  };
  const { error } = await supabase
    .from('newsletter_subscribers')
    // @ts-expect-error Supabase SDK v2.97 타입 추론 이슈 - Insert 타입은 올바름
    .upsert(subscriberData, { onConflict: 'email' });

  if (error) {
    console.error('[API] 구독 처리 실패:', error.message);
    return c.json({ error: '구독 처리에 실패했습니다.' }, 500);
  }

  return c.json({ message: '구독이 완료되었습니다.' });
});

// 서버 시작
const port = Number(process.env.PORT) || 3001;

console.log(`[서버] 논문읽어주는AI API 서버 시작 - 포트 ${port}`);

serve({
  fetch: app.fetch,
  port,
});
