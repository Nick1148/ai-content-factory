import Link from "next/link";
import { getArxivCategories } from "@/lib/data";

export default function Footer() {
  const categories = getArxivCategories();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                AI
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                논문읽어주는AI
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              매일 최신 AI 논문을 5분 만에 이해할 수 있는 한국어 해설을
              제공합니다. 연구자, 개발자, AI에 관심 있는 모든 분들을 위한
              논문 리뷰 서비스입니다.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              arXiv 카테고리
            </h3>
            <ul className="mt-4 space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/papers?category=${cat.id}`}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {cat.id} - {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              바로가기
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/papers"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  논문
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  뉴스레터
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} 논문읽어주는AI. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
