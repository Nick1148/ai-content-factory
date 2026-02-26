import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import NewsletterForm from "@/components/NewsletterForm";
import {
  getFeaturedTools,
  getTrendingTools,
  getAllCategories,
  getAllTools,
} from "@/lib/data";

export default async function HomePage() {
  const featuredTools = await getFeaturedTools();
  const trendingTools = await getTrendingTools();
  const categories = getAllCategories();
  const allTools = await getAllTools();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 pb-16 pt-20 dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            매일 새로운{" "}
            <span className="text-blue-600">AI 도구</span>를 발견하세요
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            AI Tool Radar는 최신 AI 도구를 큐레이션하고 리뷰합니다.
            트렌딩 도구부터 숨겨진 보석까지, 당신에게 딱 맞는 AI 도구를
            찾아보세요.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
            매주 엄선된 AI 도구 소식을 받아보세요. 언제든지 구독 취소 가능합니다.
          </p>
        </div>
      </section>

      {/* Trending Tools */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trending AI Tools
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                지금 가장 주목받는 AI 도구들
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Tools
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                에디터가 엄선한 추천 도구
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            카테고리별로 AI 도구를 탐색하세요
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat) => {
              const count = allTools.filter(
                (t) => t.category === cat.slug
              ).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {cat.nameKo}
                  </span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    {count} tools
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All AI Tools
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            전체 AI 도구 목록
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            매주 AI 도구 소식을 받아보세요
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            매주 엄선된 AI 도구 리뷰와 트렌드를 이메일로 보내드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
