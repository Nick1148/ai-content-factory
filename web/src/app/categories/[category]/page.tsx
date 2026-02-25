import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getToolsByCategory,
  getAllCategorySlugs,
  getAllCategories,
} from "@/lib/data";
import ToolCard from "@/components/ToolCard";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.nameKo} AI Tools - Best ${cat.name} Tools`,
    description: `${cat.description}. Browse the best AI tools in the ${cat.name} category.`,
    openGraph: {
      title: `${cat.nameKo} AI Tools`,
      description: cat.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  const tools = getToolsByCategory(category);
  const allCategories = getAllCategories();

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{cat.nameKo}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="text-4xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {cat.nameKo}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {cat.description}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
          {tools.length}개의 도구
        </p>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              이 카테고리에는 아직 등록된 도구가 없습니다.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}

        {/* Other Categories */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Other Categories
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {allCategories
              .filter((c) => c.slug !== category)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
                >
                  <span>{c.icon}</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {c.nameKo}
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
