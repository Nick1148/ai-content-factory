import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "대시보드",
  description: "AI Content Factory 운영 현황 대시보드",
};

// Supabase 클라이언트 (서버 컴포넌트에서 직접 사용)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type SupabaseDB = NonNullable<ReturnType<typeof getSupabase>>;

// 통계 데이터 타입
interface DashboardStats {
  toolCount: number;
  paperCount: number;
  publishedCount: number;
  subscriberCount: number;
}

// 최근 도구 타입
interface RecentTool {
  name: string;
  category: string;
  trend_score: number;
  created_at: string;
}

// 최근 발행 로그 타입
interface RecentPublishLog {
  platform: string;
  status: string;
  published_at: string | null;
  created_at: string;
}

// 최근 논문 타입
interface RecentPaper {
  title: string;
  title_ko: string | null;
  categories: string[] | null;
  created_at: string;
}

// 통계 카드에서 사용하는 정보
interface StatCardInfo {
  label: string;
  value: number;
  icon: string;
  color: string;
}

// 상단 통계 데이터 조회
async function fetchStats(
  db: SupabaseDB
): Promise<DashboardStats> {
  const [toolRes, paperRes, publishRes, subRes] = await Promise.all([
    db.from("tools").select("id", { count: "exact", head: true }),
    db.from("papers").select("id", { count: "exact", head: true }),
    db
      .from("publish_logs")
      .select("id", { count: "exact", head: true })
      .eq("status", "success"),
    db
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  return {
    toolCount: toolRes.count ?? 0,
    paperCount: paperRes.count ?? 0,
    publishedCount: publishRes.count ?? 0,
    subscriberCount: subRes.count ?? 0,
  };
}

// 최근 도구 5개 조회
async function fetchRecentTools(
  db: SupabaseDB
): Promise<RecentTool[]> {
  const { data, error } = await db
    .from("tools")
    .select("name, category, trend_score, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !data) return [];
  return data as RecentTool[];
}

// 최근 발행 로그 10개 조회
async function fetchRecentPublishLogs(
  db: SupabaseDB
): Promise<RecentPublishLog[]> {
  const { data, error } = await db
    .from("publish_logs")
    .select("platform, status, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !data) return [];
  return data as RecentPublishLog[];
}

// 최근 논문 5개 조회
async function fetchRecentPapers(
  db: SupabaseDB
): Promise<RecentPaper[]> {
  const { data, error } = await db
    .from("papers")
    .select("title, title_ko, categories, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !data) return [];
  return data as RecentPaper[];
}

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return dateStr.slice(0, 10);
}

// 날짜+시간 포맷 (YYYY-MM-DD HH:MM)
function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  return dateStr.slice(0, 16).replace("T", " ");
}

export default async function DashboardPage() {
  const db = getSupabase();

  // Supabase 연결 불가 시 안내 메시지
  if (!db) {
    return (
      <div className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            대시보드
          </h1>
          <div className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 p-8 text-center dark:border-yellow-700 dark:bg-yellow-900/20">
            <svg
              className="mx-auto h-12 w-12 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <h2 className="mt-4 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              데이터베이스 연결 없음
            </h2>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <code className="rounded bg-yellow-100 px-2 py-0.5 text-xs dark:bg-yellow-800">
                .env.local
              </code>{" "}
              파일에{" "}
              <code className="rounded bg-yellow-100 px-2 py-0.5 text-xs dark:bg-yellow-800">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              과{" "}
              <code className="rounded bg-yellow-100 px-2 py-0.5 text-xs dark:bg-yellow-800">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              설정을 확인하세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 모든 데이터 병렬 조회
  let stats: DashboardStats;
  let recentTools: RecentTool[];
  let recentLogs: RecentPublishLog[];
  let recentPapers: RecentPaper[];

  try {
    [stats, recentTools, recentLogs, recentPapers] = await Promise.all([
      fetchStats(db),
      fetchRecentTools(db),
      fetchRecentPublishLogs(db),
      fetchRecentPapers(db),
    ]);
  } catch {
    return (
      <div className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            대시보드
          </h1>
          <div className="mt-8 rounded-lg border border-red-300 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
              데이터 조회 실패
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Supabase에서 데이터를 가져오는 중 오류가 발생했습니다. 연결 설정을
              확인하세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 통계 카드 정보
  const statCards: StatCardInfo[] = [
    {
      label: "수집된 도구",
      value: stats.toolCount,
      icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
      color: "blue",
    },
    {
      label: "수집된 논문",
      value: stats.paperCount,
      icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
      color: "purple",
    },
    {
      label: "발행된 콘텐츠",
      value: stats.publishedCount,
      icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z",
      color: "green",
    },
    {
      label: "뉴스레터 구독자",
      value: stats.subscriberCount,
      icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
      color: "orange",
    },
  ];

  // 색상별 클래스 매핑
  const colorClasses: Record<
    string,
    { bg: string; iconBg: string; text: string }
  > = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300",
      text: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg:
        "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300",
      text: "text-purple-600 dark:text-purple-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      iconBg:
        "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300",
      text: "text-green-600 dark:text-green-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg:
        "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-300",
      text: "text-orange-600 dark:text-orange-400",
    },
  };

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            대시보드
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            AI Content Factory 운영 현황을 한눈에 확인하세요.
          </p>
        </div>

        {/* 상단 통계 카드 4개 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const colors = colorClasses[card.color];
            return (
              <div
                key={card.label}
                className={`rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800 ${colors.bg}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-2.5 ${colors.iconBg}`}>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={card.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.label}
                    </p>
                    <p
                      className={`text-2xl font-bold ${colors.text}`}
                    >
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단: 최근 도구 + 최근 논문 (2열) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 최근 수집된 도구 */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                최근 수집된 도구
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                최근 5개
              </p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentTools.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-500">
                  수집된 도구가 없습니다.
                </div>
              ) : (
                recentTools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {tool.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {tool.category} &middot;{" "}
                        {formatDate(tool.created_at)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {tool.trend_score}점
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 최근 논문 */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                최근 수집된 논문
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                최근 5개
              </p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentPapers.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-500">
                  수집된 논문이 없습니다.
                </div>
              ) : (
                recentPapers.map((paper, idx) => (
                  <div key={idx} className="px-6 py-3">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {paper.title_ko ?? paper.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {paper.categories?.[0] ?? "AI"} &middot;{" "}
                      {formatDate(paper.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 최근 발행 로그 (전체 너비) */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              최근 발행 로그
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              최근 10건
            </p>
          </div>
          {recentLogs.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-500">
              발행 기록이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">플랫폼</th>
                    <th className="px-6 py-3 font-medium">상태</th>
                    <th className="px-6 py-3 font-medium">발행일</th>
                    <th className="px-6 py-3 font-medium">기록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentLogs.map((log, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="whitespace-nowrap px-6 py-3 font-medium text-gray-900 dark:text-white">
                        {log.platform}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3">
                        {log.status === "success" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                            성공
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                            실패
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500 dark:text-gray-400">
                        {formatDateTime(log.published_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-gray-500 dark:text-gray-400">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
