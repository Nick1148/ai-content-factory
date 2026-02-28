import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaperById, getAllPaperIds, getAllPapers } from "@/lib/data";
import { PaperExplanation } from "@/lib/types";
import ShareButtonsWrapper from "./share-buttons-wrapper";
import AdSlot from "@/components/AdSlot";
import PaperCard from "@/components/PaperCard";

// 카테고리별 색상
const categoryColors: Record<string, string> = {
  "cs.AI": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "cs.LG": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "cs.CL": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "cs.CV": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  "stat.ML": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  "cs.RO": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "cs.NE": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  "cs.IR": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllPaperIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = await getPaperById(id);
  if (!paper) return { title: "논문을 찾을 수 없습니다" };

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

  // 관련 논문 추천 (같은 카테고리의 다른 논문)
  const allPapers = await getAllPapers();
  const relatedPapers = allPapers
    .filter((p) => p.id !== paper.id && p.category === paper.category)
    .slice(0, 3);

  const catColor = categoryColors[paper.category] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";

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
              홈
            </Link>
            <span>/</span>
            <Link
              href="/papers"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              논문
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
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${catColor}`}
              >
                {paper.category}
              </span>
              <time className="text-sm text-gray-500 dark:text-gray-500">
                {paper.publishedDate}
              </time>
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl" style={{ lineHeight: "1.4" }}>
              {paper.title}
            </h1>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-500">
              {paper.authors.join(", ")}
            </p>
          </div>

          {/* 공유 버튼 */}
          <div className="mb-8">
            <ShareButtonsWrapper title={paper.title} paperId={paper.id} />
          </div>

          {/* TL;DR */}
          <div className="mb-10 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6 dark:bg-blue-900/10">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
              TL;DR
            </p>
            <p className="mt-2 text-sm leading-relaxed text-blue-900 dark:text-blue-300" style={{ lineHeight: "1.8" }}>
              {paper.tldr}
            </p>
          </div>

          {/* 요약 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              요약
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400" style={{ lineHeight: "1.8" }}>
              {paper.summary}
            </p>
          </section>

          {/* 핵심 발견 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              핵심 발견
            </h2>
            <ul className="mt-4 space-y-3">
              {paper.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300" style={{ lineHeight: "1.7" }}>
                    {finding}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* 왜 중요한가 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              왜 중요한가
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400" style={{ lineHeight: "1.8" }}>
              {paper.whyItMatters}
            </p>
          </section>

          {/* 기술 상세 */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              기술 상세
            </h2>
            <div className="mt-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900/50">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" style={{ lineHeight: "1.8" }}>
                {paper.technicalDetail}
              </p>
            </div>
          </section>

          {/* 광고 슬롯 */}
          <AdSlot className="mb-10" />

          {/* arXiv 링크 */}
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

          {/* 관련 논문 */}
          {relatedPapers.length > 0 && (
            <section className="border-t border-gray-200 pt-10 dark:border-gray-800">
              <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                관련 논문
              </h2>
              <div className="space-y-4">
                {relatedPapers.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
