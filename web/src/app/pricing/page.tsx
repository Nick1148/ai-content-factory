import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - 플랜 및 요금",
  description:
    "AI Content Factory의 무료 오픈소스부터 프리미엄 플랜까지, 필요에 맞는 콘텐츠 자동화 솔루션을 선택하세요.",
};

/* ------------------------------------------------------------------
   체크 / X 아이콘 (SVG)
------------------------------------------------------------------- */
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-green-500 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
   데이터: 플랜 정보
------------------------------------------------------------------- */
interface PlanFeature {
  label: string;
  community: boolean;
  pro: boolean;
  agency: boolean;
}

const plans = [
  {
    name: "Community",
    price: "$0",
    period: "/월",
    subtitle: "영원히 무료",
    description: "오픈소스 콘텐츠 파이프라인의 모든 핵심 기능을 무료로 이용하세요.",
    highlighted: false,
    badge: null,
    features: [
      "오픈소스 코드 전체 접근",
      "Product Hunt + GitHub Trending 수집",
      "arXiv 논문 수집",
      "Gemini AI 리뷰 생성",
      "4개 플랫폼 자동 발행 (Medium, DEV.to, Hashnode, WordPress)",
      "GitHub Actions 자동화",
      "커뮤니티 지원 (GitHub Issues)",
    ],
    cta: "GitHub에서 시작하기",
    ctaHref: "https://github.com",
    ctaExternal: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/월",
    subtitle: "연간 $290 (2개월 무료)",
    description: "웹 대시보드, 고급 분석, AI 커스터마이징으로 콘텐츠 성과를 극대화하세요.",
    highlighted: true,
    badge: "추천",
    features: [
      "Community 전체 기능 포함",
      "웹 대시보드 (실시간 파이프라인 모니터링)",
      "커스텀 수집원 추가 (RSS, Twitter, Reddit 등)",
      "고급 분석 (트래픽, SEO, 콘텐츠 성과)",
      "AI 콘텐츠 커스터마이징 (톤, 길이, 키워드)",
      "이메일 뉴스레터 자동 발송",
      "우선 이메일 지원",
    ],
    cta: "Pro 시작하기",
    ctaHref: "#",
    ctaExternal: false,
  },
  {
    name: "Agency",
    price: "$300-500",
    period: "/회",
    subtitle: "일회성 설치비",
    description: "맞춤 설치부터 1:1 온보딩까지, 전문가가 직접 세팅해 드립니다.",
    highlighted: false,
    badge: null,
    features: [
      "Pro 전체 기능 포함",
      "맞춤 설치 및 환경 구축",
      "고객 분야 맞춤 수집원 설정",
      "브랜딩 커스터마이징",
      "1:1 온보딩 세션 (1시간)",
      "30일 무료 기술 지원",
    ],
    cta: "문의하기",
    ctaHref: "mailto:contact@ai-content-factory.com",
    ctaExternal: true,
  },
] as const;

const comparisonFeatures: PlanFeature[] = [
  { label: "오픈소스 코드 전체 접근", community: true, pro: true, agency: true },
  { label: "Product Hunt + GitHub Trending 수집", community: true, pro: true, agency: true },
  { label: "arXiv 논문 수집", community: true, pro: true, agency: true },
  { label: "Gemini AI 리뷰 생성", community: true, pro: true, agency: true },
  { label: "4개 플랫폼 자동 발행", community: true, pro: true, agency: true },
  { label: "GitHub Actions 자동화", community: true, pro: true, agency: true },
  { label: "커뮤니티 지원 (GitHub Issues)", community: true, pro: true, agency: true },
  { label: "웹 대시보드 (실시간 모니터링)", community: false, pro: true, agency: true },
  { label: "커스텀 수집원 추가 (RSS, Twitter 등)", community: false, pro: true, agency: true },
  { label: "고급 분석 (트래픽, SEO, 성과)", community: false, pro: true, agency: true },
  { label: "AI 콘텐츠 커스터마이징", community: false, pro: true, agency: true },
  { label: "이메일 뉴스레터 자동 발송", community: false, pro: true, agency: true },
  { label: "우선 이메일 지원", community: false, pro: true, agency: true },
  { label: "맞춤 설치 및 환경 구축", community: false, pro: false, agency: true },
  { label: "고객 분야 맞춤 수집원 설정", community: false, pro: false, agency: true },
  { label: "브랜딩 커스터마이징", community: false, pro: false, agency: true },
  { label: "1:1 온보딩 세션 (1시간)", community: false, pro: false, agency: true },
  { label: "30일 무료 기술 지원", community: false, pro: false, agency: true },
];

const faqs = [
  {
    question: "무료와 Pro의 차이가 뭔가요?",
    answer:
      "Community(무료) 플랜은 오픈소스 코드 전체에 접근할 수 있고, 기본 수집/생성/발행 파이프라인을 모두 사용할 수 있습니다. Pro 플랜은 여기에 더해 웹 대시보드, 커스텀 수집원, 고급 분석, AI 콘텐츠 커스터마이징, 이메일 뉴스레터 자동 발송 등 프리미엄 기능을 제공합니다.",
  },
  {
    question: "환불 정책은 어떻게 되나요?",
    answer:
      "Pro 플랜은 구독 시작 후 14일 이내에 환불을 요청하실 수 있습니다. Agency 서비스의 경우 작업 착수 전까지 전액 환불이 가능하며, 착수 후에는 진행 비율에 따라 부분 환불됩니다.",
  },
  {
    question: "Agency는 어떤 분야를 지원하나요?",
    answer:
      "AI/ML, SaaS, 개발자 도구, 마케팅, 교육, 헬스케어 등 다양한 분야의 콘텐츠 파이프라인 구축을 지원합니다. 특정 분야의 전문 수집원 설정과 콘텐츠 톤 맞춤화가 가능합니다.",
  },
  {
    question: "Pro에서 Agency로 업그레이드 가능한가요?",
    answer:
      "네, 가능합니다. Pro 플랜을 사용 중이라면 Agency 서비스를 추가로 신청하여 맞춤 설치 및 온보딩을 받으실 수 있습니다. 이 경우 Agency 비용에서 할인이 적용됩니다.",
  },
  {
    question: "자체 서버에 설치할 수 있나요?",
    answer:
      "네, 모든 플랜에서 자체 서버 설치가 가능합니다. Community 플랜은 오픈소스이므로 직접 설치하실 수 있고, Agency 플랜을 선택하시면 전문가가 직접 설치를 도와드립니다.",
  },
  {
    question: "기술 지원은 어떻게 받나요?",
    answer:
      "Community 플랜은 GitHub Issues를 통해 커뮤니티 지원을 받으실 수 있습니다. Pro 플랜은 우선 이메일 지원(평일 24시간 이내 응답)을 제공하며, Agency 플랜은 30일간 전담 기술 지원이 포함됩니다.",
  },
];

/* ------------------------------------------------------------------
   페이지 컴포넌트
------------------------------------------------------------------- */
export default function PricingPage() {
  return (
    <>
      {/* ── 히어로 ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pb-16 pt-20 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            당신의 콘텐츠 파이프라인을{" "}
            <span className="text-blue-600">시작하세요</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            무료 오픈소스부터 프리미엄까지, 필요에 맞는 플랜을 선택하세요
          </p>
        </div>
      </section>

      {/* ── 프라이싱 카드 ── */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-shadow ${
                plan.highlighted
                  ? "border-blue-600 shadow-lg shadow-blue-100 dark:border-blue-500 dark:shadow-blue-950/40"
                  : "border-gray-200 dark:border-gray-800"
              } bg-white dark:bg-gray-900`}
            >
              {/* 배지 */}
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              {/* 헤더 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  {plan.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              {/* 구분선 */}
              <hr className="my-6 border-gray-200 dark:border-gray-800" />

              {/* 기능 목록 */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckIcon className="mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA 버튼 */}
              <div className="mt-8">
                {plan.ctaExternal ? (
                  <a
                    href={plan.ctaHref}
                    target={plan.ctaHref.startsWith("mailto:") ? undefined : "_blank"}
                    rel={plan.ctaHref.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 비교 테이블 ── */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            플랜별 기능 비교
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            모든 기능을 한눈에 비교해 보세요
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-4 pr-4 font-semibold text-gray-900 dark:text-white">
                    기능
                  </th>
                  <th className="pb-4 text-center font-semibold text-gray-900 dark:text-white">
                    Community
                  </th>
                  <th className="pb-4 text-center font-semibold text-blue-600 dark:text-blue-400">
                    Pro
                  </th>
                  <th className="pb-4 text-center font-semibold text-gray-900 dark:text-white">
                    Agency
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={feature.label}
                    className={`border-b border-gray-100 dark:border-gray-800/60 ${
                      idx % 2 === 0 ? "bg-white dark:bg-gray-900/30" : "bg-gray-50/50 dark:bg-gray-900/10"
                    }`}
                  >
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                      {feature.label}
                    </td>
                    <td className="py-3 text-center">
                      {feature.community ? <CheckIcon className="mx-auto" /> : <XIcon className="mx-auto" />}
                    </td>
                    <td className="py-3 text-center">
                      {feature.pro ? <CheckIcon className="mx-auto" /> : <XIcon className="mx-auto" />}
                    </td>
                    <td className="py-3 text-center">
                      {feature.agency ? <CheckIcon className="mx-auto" /> : <XIcon className="mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            자주 묻는 질문
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            궁금한 점이 있으시면 편하게 문의해 주세요
          </p>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-gray-900 dark:text-white [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 하단 ── */}
      <section className="bg-gradient-to-b from-white to-blue-50 px-4 py-20 dark:from-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            무료 Community 플랜으로 콘텐츠 자동화를 경험해 보세요.
            <br />
            업그레이드는 언제든 가능합니다.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub에서 시작하기
            </a>
            <a
              href="mailto:contact@ai-content-factory.com"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              문의하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
