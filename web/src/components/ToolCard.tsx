import Link from "next/link";
import { AITool } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data";

function PricingBadge({ pricing }: { pricing: AITool["pricing"] }) {
  const styles = {
    free: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    freemium:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    paid: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    "open-source":
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const labels = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    "open-source": "Open Source",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[pricing]}`}
    >
      {labels[pricing]}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ToolCard({ tool }: { tool: AITool }) {
  const category = getCategoryBySlug(tool.category);

  return (
    <Link href={`/tools/${tool.slug}`} className="group block">
      <article className="h-full rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl dark:bg-gray-800">
              {category?.icon || "🔧"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {tool.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {category?.nameKo}
              </p>
            </div>
          </div>
          <PricingBadge pricing={tool.pricing} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {tool.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <StarRating rating={tool.rating} />
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {tool.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {tool.trending && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            Trending
          </div>
        )}
      </article>
    </Link>
  );
}
