import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "뉴스레터 - 매일 AI 논문 해설 구독",
  description:
    "매일 엄선된 AI 논문 해설을 이메일로 받아보세요. 논문읽어주는AI 뉴스레터를 구독하세요.",
};

export default function NewsletterPage() {
  return (
    <div className="px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          논문읽어주는AI 뉴스레터
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          매일 엄선된 AI 논문 해설, 핵심 인사이트, 그리고 연구 트렌드를
          이메일로 보내드립니다.
        </p>

        <div className="mt-10 flex justify-center">
          <NewsletterForm />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              매일 논문 해설
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              매일 3-5편의 최신 AI 논문을 선별하여 한국어로 쉽게
              해설합니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              연구 트렌드 분석
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              AI 연구의 최신 트렌드와 주요 동향을 주간 단위로
              분석합니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              핵심 인사이트
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              논문의 실무 적용 가능성과 산업에 미치는 영향을
              분석합니다.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-gray-50 p-8 dark:bg-gray-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            왜 구독해야 하나요?
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
              매일 수백 편의 arXiv 논문 중 핵심만 선별하여 전달
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
              5분 만에 읽을 수 있는 한국어 해설
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
