import Link from "next/link";
import { getAllCategories } from "@/lib/data";

export default function Header() {
  const categories = getAllCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                CF
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                AI Content Factory
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </Link>
              <div className="group relative">
                <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Categories
                </button>
                <div className="invisible absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.nameKo}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/papers"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Papers
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/newsletter"
              className="hidden rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:block"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
