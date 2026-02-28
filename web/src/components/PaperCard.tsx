import Link from "next/link";
import { PaperExplanation } from "@/lib/types";

// 카테고리별 색상 매핑
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

function getCategoryColor(category: string): string {
  return categoryColors[category] ?? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
}

export default function PaperCard({ paper }: { paper: PaperExplanation }) {
  return (
    <Link href={`/papers/${paper.id}`} className="group block">
      <article className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(paper.category)}`}
              >
                {paper.category}
              </span>
              <time className="text-xs text-gray-500 dark:text-gray-500">
                {paper.publishedDate}
              </time>
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {paper.title}
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {paper.authors.join(", ")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {paper.tldr}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {paper.keyFindings.slice(0, 2).map((finding, i) => (
                <span
                  key={i}
                  className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {finding.length > 60
                    ? finding.slice(0, 60) + "..."
                    : finding}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
