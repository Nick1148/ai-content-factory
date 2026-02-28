import NewsletterForm from "@/components/NewsletterForm";
import AdSlot from "@/components/AdSlot";
import { getAllPapers, getArxivCategories } from "@/lib/data";
import PapersFeed from "./papers-feed";

export default async function HomePage() {
  const papers = await getAllPapers();
  const categories = getArxivCategories();

  // 날짜별 그룹핑
  const papersByDate: Record<string, typeof papers> = {};
  for (const paper of papers) {
    const date = paper.publishedDate;
    if (!papersByDate[date]) {
      papersByDate[date] = [];
    }
    papersByDate[date].push(paper);
  }

  const sortedDates = Object.keys(papersByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pb-16 pt-20 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            AI 논문,{" "}
            <span className="text-blue-600">5분이면 충분합니다</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            매일 arXiv에 올라오는 최신 AI 논문을 한국어로 쉽게 해설합니다.
            핵심 발견부터 기술 상세까지, 바쁜 연구자와 개발자를 위한
            5분 논문 리뷰.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
            매일 엄선된 AI 논문 해설을 받아보세요. 언제든지 구독 취소 가능합니다.
          </p>
        </div>
      </section>

      {/* 논문 피드 (클라이언트 컴포넌트로 필터/검색 통합) */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              최신 논문
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              매일 업데이트되는 AI 논문 해설
            </p>
          </div>

          <PapersFeed
            papers={papers}
            categories={categories}
            papersByDate={papersByDate}
            sortedDates={sortedDates}
          />
        </div>
      </section>

      {/* 하단 뉴스레터 CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            매일 AI 논문 해설을 받아보세요
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            매일 엄선된 AI 논문 해설과 핵심 인사이트를 이메일로 보내드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
