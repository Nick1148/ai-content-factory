import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperById, getAllPaperIds } from "@/lib/data";
import { PaperExplanation } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllPaperIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPaperById(id);
  if (!paper) return { title: "Paper Not Found" };

  return {
    title: `${paper.title} - AI 논문 해설`,
    description: paper.tldr,
    openGraph: {
      title: paper.title,
      description: paper.tldr,
      type: "article",
    },
  };
}

function JsonLd({
  paper,
}: {
  paper: PaperExplanation;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    description: paper.tldr,
    author: paper.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    datePublished: paper.publishedDate,
    url: paper.arxivUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PaperDetailPage({ params }: PageProps) {
  const { id } = await params;
  const paper = await getPaperById(id);

  if (!paper) {
    notFound();
  }

  return (
    <>
      <JsonLd paper={paper} />

      <article className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/papers"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Papers
            </Link>
            <span>/</span>
            <span className="truncate text-gray-900 dark:text-white">
              {paper.title.length > 40
                ? paper.title.slice(0, 40) + "..."
                : paper.title}
            </span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {paper.category}
              </span>
              <time className="text-sm text-gray-500 dark:text-gray-500">
                {paper.publishedDate}
              </time>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
              {paper.title}
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              {paper.authors.join(", ")}
            </p>
          </div>

          {/* TL;DR */}
          <div className="mb-10 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/10">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
              TL;DR
            </p>
            <p className="mt-2 text-sm leading-relaxed text-blue-900 dark:text-blue-300">
              {paper.tldr}
            </p>
          </div>

          {/* Summary */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Summary
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {paper.summary}
            </p>
          </section>

          {/* Key Findings */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Key Findings
            </h2>
            <ul className="mt-4 space-y-3">
              {paper.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Why It Matters */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Why It Matters
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {paper.whyItMatters}
            </p>
          </section>

          {/* Technical Detail */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Technical Details
            </h2>
            <div className="mt-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/50">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {paper.technicalDetail}
              </p>
            </div>
          </section>

          {/* arXiv Link */}
          <div className="mb-10 flex items-center gap-4">
            <a
              href={paper.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              arXiv 원문 보기
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <Link
              href="/papers"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
