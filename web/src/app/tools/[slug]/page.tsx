import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getToolBySlug,
  getAllSlugs,
  getCategoryBySlug,
  getToolsByCategory,
} from "@/lib/data";
import { AITool } from "@/lib/types";
import ToolCard from "@/components/ToolCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} - AI Tool Review & Details`,
    description: tool.tagline,
    openGraph: {
      title: `${tool.name} - AI Tool Review`,
      description: tool.tagline,
      type: "article",
    },
  };
}

function JsonLd({ tool }: { tool: AITool }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: "AI Tool",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating,
      reviewCount: tool.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      price: tool.pricing === "free" || tool.pricing === "open-source" ? "0" : undefined,
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryBySlug(tool.category);
  const relatedTools = (await getToolsByCategory(tool.category)).filter(
    (t) => t.slug !== tool.slug
  );

  return (
    <>
      <JsonLd tool={tool} />

      <article className="px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link
                  href={`/categories/${category.slug}`}
                  className="hover:text-gray-900 dark:hover:text-white"
                >
                  {category.nameKo}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white">{tool.name}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-4xl dark:bg-gray-800">
              {category?.icon || "🔧"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {tool.name}
                </h1>
                {tool.trending && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    Trending
                  </span>
                )}
              </div>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {tool.tagline}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(tool.rating)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tool.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-500">
                    ({tool.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  tool.pricing === "free"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : tool.pricing === "freemium"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    : tool.pricing === "open-source"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                }`}>
                  {tool.pricing === "free" ? "Free" : tool.pricing === "freemium" ? "Freemium" : tool.pricing === "open-source" ? "Open Source" : "Paid"}
                </span>
              </div>
            </div>
          </div>

          {/* Visit Button */}
          <div className="mt-8">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Visit {tool.name}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Description */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Overview
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {tool.description}
            </p>
          </section>

          {/* Features */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Key Features
            </h2>
            <ul className="mt-4 space-y-3">
              {tool.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
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
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pros & Cons */}
          <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/10">
              <h3 className="font-bold text-green-800 dark:text-green-400">
                Pros
              </h3>
              <ul className="mt-4 space-y-2">
                {tool.pros.map((pro) => (
                  <li
                    key={pro}
                    className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300"
                  >
                    <span className="mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/10">
              <h3 className="font-bold text-red-800 dark:text-red-400">
                Cons
              </h3>
              <ul className="mt-4 space-y-2">
                {tool.cons.map((con) => (
                  <li
                    key={con}
                    className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300"
                  >
                    <span className="mt-0.5">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tags */}
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tags
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Related Tools
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                같은 카테고리의 다른 도구들
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedTools.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
