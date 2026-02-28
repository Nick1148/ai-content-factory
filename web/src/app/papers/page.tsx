import { Metadata } from "next";
import { getAllPapers, getArxivCategories } from "@/lib/data";
import PapersFeed from "../papers-feed";

export const metadata: Metadata = {
  title: "AI 논문 해설 - 최신 arXiv 논문 리뷰",
  description:
    "최신 AI/ML 논문을 한국어로 쉽게 해설합니다. 매일 업데이트되는 arXiv 논문 리뷰를 확인하세요.",
};

export default async function PapersPage() {
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
    <div className="px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            AI 논문 해설
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            최신 AI/ML 논문을 한국어로 쉽게 해설합니다
          </p>
        </div>

        <PapersFeed
          papers={papers}
          categories={categories}
          papersByDate={papersByDate}
          sortedDates={sortedDates}
        />
      </div>
    </div>
  );
}
