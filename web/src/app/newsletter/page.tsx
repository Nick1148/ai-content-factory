import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter - AI 도구 소식 구독",
  description:
    "매주 엄선된 AI 도구 리뷰와 트렌드를 이메일로 받아보세요. AI Tool Radar 뉴스레터를 구독하세요.",
};

export default function NewsletterPage() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Tool Radar Newsletter
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
          매주 엄선된 AI 도구 리뷰, 트렌드, 그리고 실용적인 활용 팁을
          이메일로 보내드립니다.
        </p>

        <div className="mt-10 flex justify-center">
          <NewsletterForm />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              🔍
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              Weekly Curation
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              매주 5-10개의 새로운 AI 도구를 직접 테스트하고 리뷰하여
              전달합니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              📊
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              Trend Analysis
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI 업계의 최신 트렌드와 주요 동향을 쉽게 이해할 수 있도록
              분석합니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              💡
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              Practical Tips
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI 도구를 실무에 바로 적용할 수 있는 실용적인 활용 팁을
              공유합니다.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-gray-50 p-8 dark:bg-gray-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Why Subscribe?
          </h3>
          <ul className="mt-4 space-y-3 text-left text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
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
              수백 개의 AI 도구 중 검증된 도구만 추천
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
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
              한국어로 쉽게 읽을 수 있는 리뷰
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
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
              무료, 스팸 없음, 언제든지 구독 취소 가능
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
